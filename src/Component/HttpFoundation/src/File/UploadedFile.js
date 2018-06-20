const DateTime = Jymfony.Component.DateTime.DateTime;
const File = Jymfony.Component.HttpFoundation.File.File;

const { Readable } = require('stream');

/**
 * @memberOf Jymfony.Component.HttpFoundation.File
 */
class UploadedFile extends File {
    /**
     * Constructor.
     *
     * @param {Buffer} buf
     * @param {string} originalName
     * @param {string} [mimeType]
     */
    __construct(buf, originalName, mimeType = undefined) {
        /**
         * @type {Buffer}
         *
         * @private
         */
        this._buf = buf;

        /**
         * @type {string}
         *
         * @private
         */
        this._originalName = originalName;

        /**
         * @type {string}
         *
         * @private
         */
        this._mimeType = mimeType || 'application/octet-stream';

        super.__construct(null, false);
    }

    /**
     * @inheritdoc
     */
    get content() {
        const stream = new Readable({
            read: () => {
                stream.push(this._buf);
                stream.push(null);
            },
        });

        return stream;
    }

    /**
     * Gets the original file name (from client).
     *
     * @returns {string}
     */
    get originalName() {
        return this._originalName;
    }

    /**
     * Gets the file size in bytes.
     *
     * @returns {int}
     */
    get size() {
        return this._buf.length;
    }

    /**
     * Gets the file mime type as sent from the client.
     *
     * @returns {string}
     */
    get mimeType() {
        return this._mimeType;
    }

    /**
     * @inheritdoc
     */
    get isReadable() {
        return true;
    }

    /**
     * @inheritdoc
     */
    get modificationTime() {
        return DateTime.now;
    }
}

module.exports = UploadedFile;
