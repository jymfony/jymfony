/**
 * @memberOf Jymfony.Component.HttpFoundation.File
 */
class UploadedFile {
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
    }

    /**
     * Gets the file content.
     *
     * @returns {Buffer}
     */
    get buffer() {
        return this._buf;
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
}

module.exports = UploadedFile;
