const File = Jymfony.Component.Filesystem.File;

/**
 * @memberOf Jymfony.Component.Filesystem
 */
export default class OpenFile extends File {
    __construct(fileName, mode = 'r') {
        super.__construct(fileName);

        /**
         * Open file's resource.
         *
         * @type {Promise<*>}
         *
         * @private
         */
        this._internalResource = undefined;

        /**
         * Whether the file is closed or not.
         *
         * @type {boolean}
         *
         * @private
         */
        this._closed = false;

        /**
         * @type {string}
         *
         * @private
         */
        this._mode = mode;
    }

    get _resource() {
        return (async () => {
            if (this._internalResource !== undefined) {
                return this._internalResource;
            }

            this._internalResource = await this._streamWrapper.streamOpen(this.filename, this._mode);
            return this._internalResource;
        })();
    }

    /**
     * Closes the file.
     *
     * @returns {Promise<void>}
     */
    async close() {
        return await this._streamWrapper.streamClose(await this._resource);
    }

    /**
     * Reads a single byte from the file.
     *
     * @returns {Promise<int>}
     */
    async fgetc() {
        this._assertOpen();

        return (await this._streamWrapper.streamRead(await this._resource, 1)).readUInt8(0);
    }

    /**
     * Reads a line from the file.
     *
     * @returns {Promise<string>}
     */
    async fgets() {
        this._assertOpen();

        const resource = await this._resource;
        let buf = '', c;

        while ('\n' !== (c = (await this._streamWrapper.streamRead(resource, 1)).toString())) {
            buf += c;
        }

        return buf;
    }

    /**
     * Reads "count" bytes from the stream.
     *
     * @param {int} count
     *
     * @returns {Promise<Buffer>}
     */
    async fread(count) {
        this._assertOpen();

        return await this._streamWrapper.streamRead(await this._resource, count);
    }

    /**
     * Writes a buffer to the stream.
     *
     * @param {Buffer} buffer
     *
     * @returns {Promise<int>}
     */
    async fwrite(buffer) {
        this._assertOpen();

        return await this._streamWrapper.streamWrite(await this._resource, buffer);
    }

    /**
     * Writes a buffer to the stream.
     *
     * @param {int} length
     *
     * @returns {Promise<void>}
     */
    async ftruncate(length) {
        this._assertOpen();

        await this._streamWrapper.streamTruncate(await this._resource, length);
    }

    /**
     * Creates a readable stream object.
     *
     * @returns {Promise<Stream.Readable>}
     */
    async createReadableStream() {
        this._assertOpen();

        return this._streamWrapper.createReadableStream(await this._resource);
    }

    /**
     * Creates a writable stream object.
     *
     * @returns {Promise<Stream.Writable>}
     */
    async createWritableStream() {
        this._assertOpen();

        return this._streamWrapper.createWritableStream(await this._resource);
    }

    /**
     * Asserts that the file is still open.
     *
     * @private
     */
    _assertOpen() {
        if (this._closed) {
            throw new RuntimeException('The file is closed.');
        }
    }
}
