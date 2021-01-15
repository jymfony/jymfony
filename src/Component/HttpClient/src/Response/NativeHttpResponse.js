import { constants as HTTP2_CONSTANTS, connect as http2Connect } from 'http2';
import { checkServerIdentity, connect as tlsConnect } from 'tls';
import { Socket } from 'net';
import { promises as fsPromises } from 'fs';
import { request as http1Request } from 'http';
import { performance } from 'perf_hooks';

const CommonResponseTrait = Jymfony.Component.HttpClient.Response.CommonResponseTrait;
const DecodingStream = Jymfony.Component.HttpClient.DecodingStream;
const ResponseInterface = Jymfony.Contracts.HttpClient.ResponseInterface;
const TransportException = Jymfony.Contracts.HttpClient.Exception.TransportException;

const { readFile } = fsPromises;

/**
 * @memberOf Jymfony.Component.HttpClient.Response
 */
export default class NativeHttpResponse extends implementationOf(ResponseInterface, CommonResponseTrait) {
    /**
     * Constructor.
     *
     * @param {URL} url
     * @param {Object.<string, *>} options
     * @param {Object.<string, *>} info
     * @param {Object.<string, *>} context
     * @param {function(): Promise<[function(): Promise<string>, URL]>} resolver
     * @param {function(dlNow: int, dlSize: int, info: *): void} onProgress
     */
    __construct(url, options, info, context, resolver, onProgress) {
        /**
         * @type {URL}
         *
         * @private
         */
        this._url = url;

        /**
         * @type {Object.<string, *>}
         *
         * @private
         */
        this._options = { ...options };

        /**
         * @type {Object.<string, *>}
         *
         * @private
         */
        this._context = context;

        /**
         * @type {Object<string, *>}
         *
         * @private
         */
        this._info = info;
        this._info.user_data = options.user_data;

        /**
         * @type {function(): Promise<[function(): Promise<null|string>, URL]>}
         *
         * @private
         */
        this._resolver = resolver;

        /**
         * @type {function(dlNow: int, dlSize: int, info: *): void}
         *
         * @private
         */
        this._onProgress = onProgress;

        /**
         * @type {Object<string, *>}
         *
         * @private
         */
        this._finalInfo = undefined;

        /**
         * @type {Object<string, string[]>}
         *
         * @private
         */
        this._headers = {};

        /**
         * @type {NodeJS.ReadStream}
         *
         * @private
         */
        this._message = undefined;

        /**
         * @type {NodeJS.ReadStream}
         *
         * @private
         */
        this._readable = undefined;

        /**
         * @type {null|Buffer}
         *
         * @private
         */
        this._buffer = null;

        /**
         * @type {null|int}
         *
         * @private
         */
        this._remaining = null;

        /**
         * @type {AbortController|undefined}
         *
         * @private
         */
        this._abortController = 'undefined' !== typeof AbortController ? new AbortController() : undefined;

        /**
         * @returns {function(): boolean}
         *
         * @private
         */
        this._initializer = () => true;

        /**
         * @type {number | null}
         *
         * @private
         */
        this._timeout = null;
    }

    /**
     * @inheritdoc
     */
    async getHeaders(Throw = true) {
        if (this._initializer) {
            await this._initialize();
        }

        const error = this.getInfo('error');
        if (null !== error) {
            throw new TransportException(error);
        }

        if (Throw) {
            this._checkStatusCode();
        }

        return __jymfony.clone(this._headers);
    }

    /**
     * @inheritdoc
     */
    cancel() {
        if (this._info.canceled) {
            return;
        }

        this._info.canceled = true;
        this._info.error = 'Response has been canceled.';

        this.close();
    }

    /**
     * @inheritdoc
     */
    getInfo(type = undefined) {
        let info = this._finalInfo;
        if (! info) {
            info = { ...this._info };
            info.url = String(info.url);

            delete info.size_body;
            delete info.request_header;

            if (null === this._message) {
                this._finalInfo = info;
            }
        }

        if (undefined !== type) {
            return undefined !== info[type] ? info[type] : null;
        }

        return info;
    }

    /**
     * @inheritdoc
     */
    async getContent(Throw = true) {
        if (this._initializer) {
            await this._initialize();
        }

        const error = this.getInfo('error');
        if (null !== error) {
            throw new TransportException(error);
        }

        if (Throw) {
            this._checkStatusCode();
        }

        if (null === this._message) {
            throw new TransportException('Request has been canceled');
        }

        if (true === this._options.buffer) {
            if (this._buffer) {
                return this._buffer;
            }

            const stream = new __jymfony.StreamBuffer();
            try {
                await this._pipeline(this._readable, stream);
            } catch (e) {
                this.close();
                this._info.error = e.message;
                throw new TransportException(e.message, 0, e);
            }

            return this._buffer = stream.buffer;
        }

        if (false === this._options.buffer) {
            if (this._readable.readableEnded ||
                (undefined === this._readable.readableEnded && this._readable._readableState.ended)
            ) {
                throw new TransportException('Cannot get the content of the response twice: buffering is disabled.');
            }

            return this._readable;
        }

        if (null === this._readable) {
            throw new TransportException('Cannot get the content of the response twice: buffering is disabled.');
        }

        try {
            return this._pipeline(this._readable, this._options.buffer);
        } finally {
            this._readable = null;
        }
    }

    close() {
        if (this._abortController) {
            this._abortController.abort();
        }

        if (this._timeout) {
            clearTimeout(this._timeout);
        }

        this._message = this._timeout = this._readable = this._onProgress = this._abortController = null;
    }

    async _perform() {
        await this._open();
        if (! this._message) {
            return;
        }

        const contentEncoding = this._headers['content-encoding'] ? this._headers['content-encoding'][0] : undefined;
        const decodingStream = new DecodingStream(contentEncoding || DecodingStream.ENCODING_NONE, {
            onProgress: current => {
                this._remaining = 0 < this._info.size_download ? this._info.size_download - current : this._remaining;
                if (0 === this._remaining) {
                    if (null !== this._timeout) {
                        this._timeout.unref();
                        clearTimeout(this._timeout);
                        this._timeout = null;
                    }

                    this._message.removeAllListeners('timeout');
                }

                if (this._onProgress) {
                    this._onProgress(current, this._info.size_download, this._info);
                }
            },
        });

        this._info.total_time = this._info.starttransfer_time = performance.now() - this._info.start_time;
        this._readable = this._message.pipe(decodingStream);
        this._readable.on('end', () => {
            if (null !== this._timeout) {
                this._timeout.unref();
                clearTimeout(this._timeout);
                this._timeout = null;
            }

            this._message.removeAllListeners('timeout');
        });
    }

    async _open() {
        const context = this._context;

        try {
            this._info.start_time = performance.now();

            let [ resolver, url ] = await this._resolver();
            context.http.url = String(url);

            while (true) {
                const currentIp = this._info.primary_ip;
                if (! currentIp) {
                    throw new TransportException(__jymfony.sprintf('Cannot reach host %s: unknown address', url.host));
                }

                const proxy = context.http.proxy || null;
                if (proxy) {
                    this._info.debug += '* Establish HTTP proxy tunnel to ' + proxy + '\n';
                    this._info.request_header = url.href;
                } else {
                    this._info.debug += '*   Trying ' + this._info.primary_ip + '...\n';
                    this._info.request_header = url.pathname + (url.query || '');
                }

                this._info.request_header = __jymfony.sprintf('> %s %s HTTP/%s\r\n', context.http.method, this._info.request_header, context.http.protocol_version);
                this._info.request_header += context.http.headers.join('\r\n') + '\r\n\r\n';
                this._info.debug += this._info.request_header;

                const socket = new Socket();
                let stream = socket;
                try {
                    await new Promise((resolve, reject) => {
                        socket.on('error', reject);
                        socket.on('connect', resolve);

                        let localAddress, localPort;
                        const match = context.socket.bind_to.match(/^(.*):(\d+)$/);
                        if (match) {
                            [ , localAddress, localPort ] = match;
                            localAddress = '0' === localAddress ? undefined : localAddress;
                            localPort = '0' === localPort ? undefined : localPort;
                        }

                        socket.connect({
                            host: currentIp,
                            port: this._info.primary_port,
                            localAddress,
                            localPort: localPort ? ~~localPort : localPort,
                        });

                        socket.setNoDelay(context.socket.tcp_nodelay);
                    });
                } catch (e) {
                    context.ips.shift();
                    if (0 === context.ips.length) {
                        throw e;
                    }

                    this._info.primary_ip = context.ips[0];
                    continue;
                } finally {
                    socket.removeAllListeners('error');
                }

                socket.on('error', e => {
                    if ('ECONNRESET' === e.code) {
                        // Connection has been closed
                        const message = this._readable || this._message;
                        if (message) {
                            message.emit('error', new TransportException(e.message));
                        } else {
                            this.close();
                            this._info.error = e.message;
                        }
                    }

                    // Do not throw error: should be handled elsewhere anyway.
                });

                this._info.connect_time = performance.now() - this._info.start_time;
                if ('https:' === url.protocol) {
                    const alpnProtocols = [ 'http/1.1', 'http/1.0' ];
                    if ('2' === context.http.protocol_version) {
                        alpnProtocols.unshift('h2');
                    }

                    const ca = isString(context.ssl.ca) ? await readFile(context.ssl.ca) : context.ssl.ca;
                    const cert = isString(context.ssl.cert) ? await readFile(context.ssl.cert) : context.ssl.cert;
                    const key = isString(context.ssl.private_key) ? await readFile(context.ssl.private_key) : context.ssl.private_key;
                    const passphrase = isString(context.ssl.passphrase) ? await readFile(context.ssl.passphrase) : context.ssl.passphrase;

                    stream = await new Promise((resolve, reject) => {
                        const tlsSocket = tlsConnect({
                            socket,
                            ALPNProtocols: alpnProtocols,
                            servername: url.host,
                            ca,
                            cert,
                            key,
                            passphrase,
                            rejectUnauthorized: this._options.verify_peer,
                            ciphers: context.ssl.ciphers,
                            checkServerIdentity: (host, peerCertificate) => {
                                if (this._options.verify_host) {
                                    checkServerIdentity(host, peerCertificate);
                                }
                            },
                        }, () => resolve(tlsSocket));

                        tlsSocket.on('tlsClientError', reject);
                        tlsSocket.on('error', reject);
                    });

                    this._info.peer_certificate_chain = this._options.capture_peer_cert_chain ? stream.getPeerCertificate(true) : null;
                    if ('h2' === stream.alpnProtocol) {
                        context.http.protocol_version = '2';
                    } else {
                        context.http.protocol_version = '1.1';
                    }
                }

                const headers = context.http.headers.reduce((cur, hdr) => {
                    const idx = hdr.indexOf(':');
                    if (-1 === idx) {
                        return cur;
                    }

                    const name = hdr.substr(0, idx);
                    cur[name] = __jymfony.trim(hdr.substr(idx + 1));

                    return cur;
                }, {});

                let content = context.http.content ? context.http.content : null;
                if (content) {
                    if (isFunction(content.copy)) {
                        content = content.copy();
                    }

                    if (content.readableEnded) {
                        throw new TransportException('Provided content stream cannot be read more than once');
                    }
                }

                if ('2' === context.http.protocol_version) {
                    const client = http2Connect(url, {
                        createConnection: () => stream,
                        timeout: context.http.timeout * 1000,
                    });

                    const [ http2Stream, responseHeaders ] = await new Promise((resolve, reject) => {
                        const rej = err => {
                            this._abortController = null;
                            reject(err);
                        };

                        const h2Headers = Object.keys(headers)
                            .reduce((cur, idx) => {
                                if (idx.match(/^host$/i)) {
                                    return cur;
                                }

                                cur[idx] = headers[idx];
                                return cur;
                            }, {});

                        const stream = client.request({
                            [HTTP2_CONSTANTS.HTTP2_HEADER_METHOD]: context.http.method,
                            [HTTP2_CONSTANTS.HTTP2_HEADER_PATH]: url.pathname + (url.search || ''),
                            [HTTP2_CONSTANTS.HTTP2_HEADER_SCHEME]: url.protocol.substr(0, url.protocol.length - 1),
                            [HTTP2_CONSTANTS.HTTP2_HEADER_AUTHORITY]: url.origin.substr(url.protocol.length + 2),
                            ...h2Headers,
                        }, {
                            signal: this._abortController ? this._abortController.signal : undefined,
                        });

                        stream.on('response', headers => {
                            stream.removeListener('error', rej);
                            resolve([ stream, headers ]);
                        });

                        stream.on('error', rej);

                        if (content) {
                            content.on('error', (err) => {
                                stream.destroy(err);
                            });

                            content.pipe(stream);
                        } else {
                            stream.end();
                        }
                    });

                    this._message = http2Stream;
                    this._addHttp2ResponseHeaders(responseHeaders);
                } else {
                    this._message = await new Promise((resolve, reject) => {
                        const rej = err => {
                            this._abortController = null;
                            reject(err);
                        };

                        const req = http1Request({
                            createConnection: () => stream,
                            path: url.pathname + (url.search || ''),
                            method: context.http.method,
                            headers,
                            signal: this._abortController ? this._abortController.signal : undefined,
                            timeout: context.http.timeout * 1000,
                        }, message => {
                            req.removeListener('error', rej);
                            if (undefined !== message) {
                                resolve(message);
                            }
                        });

                        if (content) {
                            content.on('error', (err) => {
                                req.destroy(err);
                            });

                            content.pipe(req);
                        } else {
                            req.end();
                        }

                        req.on('error', rej);
                    });

                    this._addHttp1ResponseHeaders();
                }

                const location = this._info.response_headers.location ? this._info.response_headers.location[0] : null;
                url = await resolver(location, context);

                const timeoutFn = () => {
                    const message = this._readable || this._message;
                    message.emit('error', new TransportException('Request timed out'));
                };

                this._message.on('timeout', timeoutFn);
                this._timeout = setTimeout(timeoutFn, context.http.timeout * 1000);

                socket.end();

                if (null === url) {
                    this._headers = __jymfony.deepClone(this._info.response_headers);
                    break;
                }

                this._message.removeListener('timeout', timeoutFn);
                clearTimeout(this._timeout);
                this._timeout = null;

                this._info.debug += __jymfony.sprintf('\nRedirecting: "%s %s"\n', this._info.http_code, url || this._url);
            }
        } catch (e) {
            this.close();
            throw e;
        } finally {
            this._info.pretransfer_time = this._info.total_time = performance.now() - this._info.start_time;
        }

        if (isFunction(this._options.buffer)) {
            try {
                this._options.buffer = this._options.buffer(this._headers);
            } catch (e) {
                throw new TransportException(e.message, 0, e);
            }
        }

        this._context = this._resolver = null;

        if (undefined !== this._headers['content-length']) {
            this._remaining = ~~this._headers['content-length'][0];
        } else {
            this._remaining = -1;
        }

        this._info.size_download = this._remaining;

        if ('HEAD' === context.http.method || [ 204, 304 ].includes(this._info.http_code)) {
            return;
        }

        if (this._onProgress) {
            this._onProgress(0, this._remaining, this._info);
        }
    }

    /**
     * Adds status code and headers to this response from http1 incoming message.
     *
     * @private
     */
    _addHttp1ResponseHeaders() {
        const message = this._message;
        const info = this._info;

        info.response_headers = {};
        for (const [ key, value ] of __jymfony.getEntries(message.headers)) {
            info.response_headers[key] = isArray(value) ? value : [ value ];
        }

        info.http_code = message.statusCode;
        info.debug += __jymfony.sprintf('< HTTP/%s %u %s \r\n', message.httpVersion, message.statusCode, message.statusMessage);
        info.debug += '< \r\n';

        if (! info.http_code) {
            throw new TransportException(__jymfony.sprintf('Invalid or missing HTTP status line for "%s".', info.url));
        }
    }

    /**
     * Adds status code and headers to this response from http2 headers.
     *
     * @param {Object.<string, *>} headers
     *
     * @private
     */
    _addHttp2ResponseHeaders(headers) {
        const info = this._info;
        info.response_headers = {};
        for (const [ key, value ] of __jymfony.getEntries(headers)) {
            if (! isString(key) || key.startsWith(':')) {
                continue;
            }

            info.response_headers[key] = isArray(value) ? value : [ value ];
        }

        info.http_code = headers[HTTP2_CONSTANTS.HTTP2_HEADER_STATUS];
        info.debug += __jymfony.sprintf('< HTTP/2 %u\r\n', info.http_code);
        info.debug += '< \r\n';

        if (! info.http_code) {
            throw new TransportException(__jymfony.sprintf('Invalid or missing HTTP status code for "%s".', info.url));
        }
    }
}
