const File = Jymfony.Component.Filesystem.File;

/**
 * @memberOf Jymfony.Component.Filesystem.StreamWrapper.File
 */
export default class Resource {
    /**
     * Constructor.
     *
     * @param {FileHandle} handle
     * @param {fs.Stats} stat
     */
    __construct(handle, stat) {
        /**
         * File descriptor.
         *
         * @type {FileHandle}
         *
         * @private
         */
        this._handle = handle;

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
     * Gets the file handle.
     *
     * @returns {FileHandle}
     */
    get handle() {
        return this._handle;
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
     * Advances position of the stream of count bytes.
     *
     * @param {int} count
     */
    advance(count) {
        this._position += count;
    }
}
