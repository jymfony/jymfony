import { existsSync, realpathSync, statSync } from 'fs';

const SelfCheckingResourceInterface = Jymfony.Component.Config.Resource.SelfCheckingResourceInterface;

/**
 * @memberOf Jymfony.Component.Config.Resource
 */
export default class FileResource extends implementationOf(SelfCheckingResourceInterface) {
    /**
     * Constructor.
     *
     * @param {*} resource
     */
    __construct(resource) {
        this._resource = realpathSync(resource);
    }

    /**
     * @inheritdoc
     */
    toString() {
        return this._resource;
    }

    /**
     * @inheritdoc
     */
    isFresh(timestamp) {
        return existsSync(this._resource) && statSync(this._resource).mtime <= timestamp;
    }
}
