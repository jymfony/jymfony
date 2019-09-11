import { Socket as NetSocket } from 'net';
import { TLSSocket as TlsSocket } from 'tls';
import { parse } from 'url';

const AbstractProcessingHandler = Jymfony.Component.Logger.Handler.AbstractProcessingHandler;
const LogLevel = Jymfony.Component.Logger.LogLevel;

/**
 * @memberOf Jymfony.Component.Logger.Handler
 */
export default class SocketHandler extends AbstractProcessingHandler {
    /**
     * Constructor.
     *
     * @param {string} connectionString
     * @param {int} level
     * @param {boolean} bubble
     */
    __construct(connectionString, level = LogLevel.DEBUG, bubble = true) {
        super.__construct(level, bubble);

        /**
         * @type {string}
         *
         * @private
         */
        this._connectionString = connectionString;

        /**
         * @type {Promise<void>}
         *
         * @private
         */
        this._connection = undefined;

        /**
         * @type {NetSocket}
         *
         * @private
         */
        this._socket = undefined;
    }

    /**
     * Closes the connection.
     */
    close() {
        if (undefined !== this._connection) {
            this._socket.close();
            this._connection = undefined;
        }
    }

    /**
     * Connects the handler.
     */
    connect() {
        const url = parse(this._connectionString);
        let socket = new NetSocket();

        if ('ssl' === url.protocol || 'tls' === url.protocol) {
            socket = new TlsSocket(socket);
        } else if ('tcp' !== url.protocol) {
            throw new UnexpectedValueException('Unknown protocol "'+url.protocol+'"');
        }

        this._connection = new Promise((resolve, reject) => {
            this._socket = socket;

            socket.on('error', err => reject(err));
            socket.on('close', () => this.close());
            socket.on('data', () => { /* No-op */ });

            socket.connect({
                port: url.port,
                host: url.host,
            }, resolve);
        });

        this._connection.catch(() => this.close());
    }

    /**
     * Generates data to be sent via socket.
     *
     * @param {Object.<*>} record
     *
     * @protected
     */
    _generateDataStream(record) {
        return JSON.stringify(record.formatted);
    }

    /**
     * @inheritdoc
     */
    _write(record) {
        if (undefined === this._connection) {
            this.connect();
        }

        this._connection.then(() => {
            if (undefined === this._connection) {
                return;
            }

            return this._socket.write(this._generateDataStream(record));
        });
    }
}
