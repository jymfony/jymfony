import { createWriteStream, openSync } from 'fs';
import { dirname } from 'path';

const AbstractProcessingHandler = Jymfony.Component.Logger.Handler.AbstractProcessingHandler;
const LogLevel = Jymfony.Component.Logger.LogLevel;

/**
 * @memberOf Jymfony.Component.Logger.Handler
 */
export default class StreamHandler extends AbstractProcessingHandler {
    /**
     * Constructor.
     *
     * @param {Writable|string} stream
     * @param {int} [level = LogLevel.DEBUG]
     * @param {boolean} [bubble = true]
     * @param {string} [filePermission]
     */
    __construct(stream, level = LogLevel.DEBUG, bubble = true, filePermission = undefined) {
        super.__construct(level, bubble);

        /**
         * @type {string}
         *
         * @private
         */
        this._file = undefined;

        /**
         * @type {string}
         *
         * @private
         */
        this._filePermission = undefined;

        /**
         * @type {Writable}
         *
         * @private
         */
        this._stream = undefined;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._dirCreated = false;

        if (isString(stream)) {
            this._file = stream;
            this._filePermission = filePermission;
        } else {
            this._stream = stream;
        }
    }

    /**
     * Opens the stream if needed.
     */
    open() {
        if (undefined === this._stream) {
            this._createDir();
            const fd = openSync(this._file, 'a', this._filePermission || 0o666);
            this._stream = createWriteStream(this._file, {
                fd,
            });

            process.on('exit', () => this.close());
        }
    }

    /**
     * Flushes the stream and closes it.
     */
    close() {
        this._stream.end('');
        this._stream = undefined;
    }

    /**
     * @inheritdoc
     */
    _write(record) {
        this.open();
        this._streamWrite(record);
    }

    /**
     * Writes a record to the stream
     *
     * @param {Object.<string, *>} record
     *
     * @private
     */
    _streamWrite(record) {
        this._stream.cork();
        this._stream.write(record.formatted);
        this._stream.uncork();
    }

    /**
     * Creates a dir where to put the log file to be created.
     *
     * @private
     */
    _createDir() {
        if (this._dirCreated) {
            return;
        }

        this._dirCreated = true;
        try {
            __jymfony.mkdir(dirname(this._file));
        } catch (e) {
            if ('EEXIST' !== e.code) {
                throw e;
            }
        }
    }
}
