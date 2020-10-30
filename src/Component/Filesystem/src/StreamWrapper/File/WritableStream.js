import { Writable } from 'stream';

/**
 * @memberOf Jymfony.Component.Filesystem.StreamWrapper.File
 */
export default class WritableStream extends Writable {
    /**
     * Constructor
     *
     * @param {Jymfony.Component.Filesystem.StreamWrapper.File.Resource} resource
     */
    constructor(resource) {
        super();

        /**
         * @type {Jymfony.Component.Filesystem.StreamWrapper.File.Resource}
         *
         * @private
         */
        this._resource = resource;
    }

    /**
     * @param {Buffer|string} chunk
     * @param {string} encoding
     * @param {Function} callback
     *
     * @returns {Promise<void>}
     *
     * @private
     */
    async _write(chunk, encoding, callback) {
        const handle = this._resource.handle;

        try {
            if (! isBuffer(chunk)) {
                chunk = Buffer.from(chunk, encoding);
            }

            const { bytesWritten } = await handle.write(chunk, 0, chunk.length, this._resource.position);
            this._resource.advance(bytesWritten);

            callback();
        } catch (err) {
            callback(err);
        }
    }
}
