const SelfCheckingResourceInterface = Jymfony.Component.Config.Resource.SelfCheckingResourceInterface;
const fs = require('fs');

/**
 * @memberOf Jymfony.Component.Config.Resource
 */
class FileResource extends implementationOf(SelfCheckingResourceInterface) {
    /**
     * Constructor.
     *
     * @param {*} resource
     */
    __construct(resource) {
        this._resource = fs.realpathSync(resource);
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
        return fs.existsSync(this._resource) && fs.statSync(this._resource).mtime <= timestamp;
    }
}

module.exports = FileResource;
