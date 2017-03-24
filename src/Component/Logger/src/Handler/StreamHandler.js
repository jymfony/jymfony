const fs = require('fs');
const path = require("path");
const AbstractProcessingHandler = Jymfony.Component.Logger.Handler.AbstractProcessingHandler;
const LogLevel = Jymfony.Component.Logger.LogLevel;

/**
 * @memberOf Jymfony.Component.Logger.Handler
 */
class StreamHandler extends AbstractProcessingHandler {
    /**
     * {@inheritDoc}
     *
     * @param {Writable|string} stream
     * @param filePermission
     */
    __construct(stream, level = LogLevel.DEBUG, bubble = true, filePermission = null) {
        super.__construct(level, bubble);

        if (isString(stream)) {
            /**
             * @type {string}
             *
             * @private
             */
            this._file = stream;
            this._filePermission = filePermission;
        } else {
            /**
             * @type {Writable}
             *
             * @private
             */
            this._stream = stream;
        }
    }

    _write(record) {
        if (undefined === this._stream) {
            this._createDir();

            const opts = {
                mode: this._filePermission,
                flags: 'a',
            };
            this._stream = fs.createWriteStream(this._file, opts);
        }

        this._streamWrite(record);
    }

    /**
     * Writes a record to the stream
     *
     * @param {Object<string, *>} record
     *
     * @private
     */
    _streamWrite(record) {
        this._stream.write(record.formatted);
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
        path.dirname(this._file)
            .split(path.sep)
            .reduce((acc, folder) => {
                acc += folder + path.sep;
                if (! fs.existsSync(acc)) {
                    fs.mkdirSync(acc, 0o777);
                }

                return acc;
            }, '');
    }
}

module.exports = StreamHandler;
