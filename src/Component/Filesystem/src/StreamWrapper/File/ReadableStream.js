import { Readable } from 'stream';

/**
 * @memberOf Jymfony.Component.Filesystem.StreamWrapper.File
 * @internal Use this instead of fs.createReadableStream led to undefined behavior
 *      (https://github.com/nodejs/node/issues/35862).
 */
export default class ReadableStream extends Readable {
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
     * @param {number} size
     *
     * @returns {Promise<void>}
     */
    async _read(size) {
        const handle = this._resource.handle;
        let result;

        try {
            do {
                const { buffer, bytesRead } = await handle.read(Buffer.alloc(size), 0, size, this._resource.position);

                if (0 === bytesRead) {
                    this.push(null);
                    return;
                }

                this._resource.advance(bytesRead);
                if (bytesRead !== size) {
                    result = this.push(buffer.slice(0, bytesRead));
                } else {
                    result = this.push(buffer);
                }
            } while (result);
        } catch (err) {
            this.destroy(err);
        }
    }
}
