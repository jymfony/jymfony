const SelfCheckingResourceInterface = Jymfony.Component.Config.Resource.SelfCheckingResourceInterface;
const fs = require('fs');

module.exports = class FileResource extends implementationOf(SelfCheckingResourceInterface) {
    constructor(resource) {
        super();

        this._resource = fs.realpathSync(resource);
    }

    /**
     * {@inheritDoc}
     */
    toString() {
        return this._resource;
    }

    /**
     * {@inheritDoc}
     */
    isFresh(timestamp) {
        return fs.existsSync(this._resource) && fs.statSync(this._resource).mtime <= timestamp;
    }
};
