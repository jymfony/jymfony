const File = Jymfony.Component.Filesystem.File;

/**
 * @memberOf Jymfony.Component.Filesystem.StreamWrapper.File
 */
class Resource {
    /**
     * Constructor.
     *
     * @param {int} fd
     * @param {fs.Stats} stat
     */
    __construct(fd, stat) {
        /**
         * File descriptor.
         *
         * @type {int}
         *
         * @private
         */
        this._fd = fd;

        /**
         * Current position.
         *
         * @type {int}
         *
         * @private
         */
        this._position = 0;

        /**
         * File stats at opening.
         *
         * @type {fs.Stats}
         *
         * @private
         */
        this._stats = stat;
    }

    /**
     * Alters current resource position.
     *
     * @param {int} position
     * @param {File.SEEK_SET|File.SEEK_CUR|File.SEEK_END} whence
     */
    seek(position, whence = File.SEEK_SET) {
        switch (whence) {
            case File.SEEK_SET:
                this._position = position;
                break;

            case File.SEEK_CUR:
                this._position += position;
                break;

            case File.SEEK_END:
                this._position = this._stats.size + position;
                break;
        }
    }

    /**
     * Gets the file descriptor number.
     *
     * @returns {int}
     */
    get fd() {
        return this._fd;
    }

    /**
     * Gets the current position.
     *
     * @returns {int}
     */
    get position() {
        return this._position;
    }

    /**
     * Advances position of the strea of count bytes.
     *
     * @param {int} count
     */
    advance(count) {
        this._position += count;
    }
}

module.exports = Resource;
