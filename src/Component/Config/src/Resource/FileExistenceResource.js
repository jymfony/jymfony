import { existsSync } from 'fs';

const SelfCheckingResourceInterface = Jymfony.Component.Config.Resource.SelfCheckingResourceInterface;

/**
 * FileExistenceResource represents a resource stored on the filesystem.
 * Freshness is only evaluated against resource creation or deletion.
 *
 * The resource can be a file or a directory.
 *
 * @memberOf Jymfony.Component.Config.Resource
 */
export default class FileExistenceResource extends implementationOf(SelfCheckingResourceInterface) {
    /**
     * @param {string} resource The file path to the resource
     */
    __construct(resource) {
        /**
         * @type {string}
         *
         * @private
         */
        this._resource = resource;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._exists = existsSync(resource);
    }

    /**
     * @inheritdoc
     */
    toString() {
        return this._resource;
    }

    /**
     * @returns {string} The file path to the resource
     */
    get resource() {
        return this._resource;
    }

    /**
     * @inheritdoc
     */
    isFresh() {
        return existsSync(this._resource) === this._exists;
    }
}
