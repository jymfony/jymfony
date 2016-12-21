const ResourceCheckerConfigCache = Jymfony.Config.ResourceCheckerConfigCache;
const SelfCheckingResourceChecker = Jymfony.Config.Resource.SelfCheckingResourceChecker;
const fs = require('fs');

module.exports = class ConfigCache extends ResourceCheckerConfigCache {
    /**
     * Creates a ConfigCache class
     *
     * @param {string} file
     * @param {boolean} debug
     */
    constructor(file, debug) {
        let checkers = [];
        if (! debug) {
            checkers = [ new SelfCheckingResourceChecker() ];
        }

        super(file, checkers);
        this._debug = debug;
    }

    /**
     * {@inheritDoc}
     */
    isFresh() {
        if (! this._debug && fs.existsSync(this._file)) {
            return true;
        }

        return super.isFresh();
    }
};
