const IOException = Jymfony.Component.Filesystem.Exception.IOException;
const File = Jymfony.Component.Filesystem.Filesystem.File;

const dns = require('dns');
const TcpSocket = require('net').Socket;
const PassThru = require('stream').PassThrough;
const TlsSocket = require('tls').TLSSocket;
const urlParse = require('url').parse;
const promisify = require('util').promisify;
const zlib = require('zlib');

const resolve6 = promisify(dns.resolve6);
const resolve4 = promisify(dns.resolve4);

/**
 * @memberOf Jymfony.Component.Filesystem.StreamWrapper.Http
 */
class Resource {
    /**
     * Constructor.
     *
     * @param {string} path
     * @param {Object} headers
     */
    __construct(path, headers) {
        /**
         * @type {string}
         *
         * @private
         */
        this._path = path;

        /**
         * @type {int|undefined}
         *
         * @private
         */
        this._size = undefined !== headers.headers['content-length'] ? ~~headers.headers['content-length'] : undefined;

        /**
         * @type {Date}
         */
        this.date = undefined !== headers.headers['date'] ? new Date(headers.headers['date']) : undefined;

        /**
         * @type {boolean}
         */
        this.isLink = 300 <= headers.statusCode && 400 > headers.statusCode;

        /**
         * @type {undefined|string}
         */
        this.location = headers.headers['location'] || path;

        /**
         * @type {boolean}
         */
        this.exists = 400 <= headers.statusCode && 500 > headers.statusCode;
    }

    /**
     * Gets the size of the resource in bytes, if returned by the server.
     *
     * @returns {int}
     */
    get size() {
        return this._size;
    }

    /**
     * Creates a readable stream for this HTTP resource.
     *
     * @returns {Promise<Stream.Readable>}
     */
    readableStream() {
        const stream = new PassThru();

        (async () => {
            const url = urlParse(this._path);
            const socket = await __self._socket(url);
            const p = new Promise(resolve => {
                let data = Buffer.allocUnsafe(0);
                socket.on('data', (bytes) => data = Buffer.concat([ data, bytes ]));
                socket.on('end', () => resolve(data));
            });

            socket.write(
                'GET ' + url.path + ' HTTP/1.0\r\n' +
                'Host: ' + url.hostname + '\r\n' +
                'Accept: */*\r\n' +
                'User-Agent: Jymfony/0.1\r\n' +
                'Connection: close\r\n' +
                'Accept-Encoding: deflate, gzip\r\n' +
                '\r\n'
            );

            const buffer = await p;
            const headersLimit = buffer.indexOf('\r\n\r\n', 2);

            const headers = __self._parseHeaders(buffer.slice(0, headersLimit).toString().split('\r\n'));
            if (200 > headers.statusCode || 300 <= headers.statusCode) {
                stream.destroy(new IOException(__jymfony.sprintf(
                    'Server returned %u %s while requesting %s',
                    headers.statusCode,
                    headers.statusText,
                    this._path
                )));

                return;
            }

            const body = buffer.slice(headersLimit + 4);

            switch (headers.headers['content-encoding']) {
                case 'gzip':
                case 'deflate': {
                    const unzip = zlib.createUnzip();
                    unzip.pipe(stream);
                    unzip.end(body);
                } break;

                default:
                    stream.end(body);
                    break;
            }
        })();

        return stream;
    }

    /**
     * Reads "count" bytes from the stream.
     *
     * @param {int} count
     *
     * @returns {Promise<Buffer|null>}
     */
    async fread(count) {
        if (undefined === this._internalBuffer) {
            const bufs = [];
            const stream = await this.readableStream();

            stream.on('data', b => bufs.push(b));

            /**
             * @type {Buffer}
             * @private
             */
            this._internalBuffer = await new Promise((resolve, reject) => {
                stream.on('end', () => resolve(Buffer.concat(bufs)));
                stream.on('error', err => reject(err));
            });
            this._position = 0;
        }

        if (this._position >= this._internalBuffer.length) {
            return null;
        }

        const end = Math.min(this._position + count, this._internalBuffer.length);
        const buf = this._internalBuffer.slice(this._position, end);
        this._position = end;

        return buf;
    }

    /**
     * Alters current resource position.
     *
     * @param {int} position
     * @param {File.SEEK_SET|File.SEEK_CUR|File.SEEK_END} whence
     */
    seek(position, whence = File.SEEK_SET) {
        if (undefined === this._position) {
            return;
        }

        switch (whence) {
            case File.SEEK_CUR:
                this._position += position;
                break;
        }
    }

    /**
     * Performs a HEAD request and returns the headers.
     *
     * @param {string} path
     *
     * @returns {Promise<Object>} The headers.
     */
    static async head(path) {
        const url = urlParse(path);
        const socket = await __self._socket(url);

        const p = new Promise(resolve => {
            let data = '';
            socket.on('data', (bytes) => data += bytes.toString());
            socket.on('end', () => resolve(data));
        });

        socket.write(
            'HEAD ' + url.path + ' HTTP/1.1\r\n' +
            'Host: ' + url.hostname + '\r\n' +
            'Accept: */*\r\n' +
            'User-Agent: Jymfony/0.1\r\n' +
            'Connection: close\r\n' +
            '\r\n'
        );

        const header = (await p).split('\r\n').filter(str => !! str);
        const headers = __self._parseHeaders(header);

        if (500 <= headers.statusCode) {
            throw new RuntimeException(__jymfony.sprintf(
                'Internal server error while requesting %s',
                path
            ));
        }

        if (400 <= headers.statusCode) {
            const error = new Error(headers.statusText);
            error.code = 'ENOENT';

            throw error;
        }

        return headers;
    }

    /**
     * Parses header and status line.
     *
     * @param {string[]} headers
     *
     * @private
     */
    static _parseHeaders(headers) {
        const statusLine = headers.shift();
        const m = /^HTTP\/(\d\.\d) (\d+) (.+)$/g.exec(statusLine);

        const obj = {
            protocolVersion: m[1],
            statusCode: ~~m[2],
            statusText: m[3],
            headers: {},
        };

        for (const hdr of headers) {
            const [ name, value ] = hdr.split(': ', 2);
            const lowerName = name.toLowerCase();

            if (undefined !== obj.headers[lowerName]) {
                obj.headers[lowerName] = [ obj.headers[lowerName] ];
                obj.headers[lowerName].push(value);
            } else {
                obj.headers[lowerName] = value;
            }
        }

        return obj;
    }

    /**
     * Creates a socket.
     *
     * @param {Url} url
     *
     * @returns {Promise<TcpSocket>}
     *
     * @private
     */
    static async _socket(url) {
        const connSocket = new TcpSocket();
        const socket = 'https:' === url.protocol ? new TlsSocket(connSocket) : connSocket;

        const tryConnect = async (resolveMethod) => {
            let addresses;
            try {
                addresses = await resolveMethod(url.hostname);
            } catch (e) {
                return undefined;
            }

            for (const addr of addresses) {
                try {
                    return await new Promise(((resolve, reject) => {
                        connSocket.on('error', reject);
                        socket.on('connect', () => resolve(socket));

                        connSocket.connect({
                            host: addr,
                            port: url.port || ('https:' === url.protocol ? 443 : 80),
                        });
                    }));
                } catch (e) {
                    if ('EHOSTUNREACH' !== e.code && 'ECONNREFUSED' !== e.code) {
                        throw e;
                    }
                }
            }

            return undefined;
        };

        const v6 = await tryConnect(resolve6);
        if (undefined !== v6) {
            return v6;
        }

        const v4 = await tryConnect(resolve4);
        if (undefined !== v4) {
            return v4;
        }

        throw new RuntimeException(__jymfony.sprintf('Cannot connect to %s', url.hostname));
    }
}

module.exports = Resource;
