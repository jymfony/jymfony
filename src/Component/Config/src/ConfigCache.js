import { existsSync } from 'fs';
const ResourceCheckerConfigCache = Jymfony.Component.Config.ResourceCheckerConfigCache;
const SelfCheckingResourceChecker = Jymfony.Component.Config.Resource.SelfCheckingResourceChecker;

/**
 * @memberOf Jymfony.Component.Config
 */
export default class ConfigCache extends ResourceCheckerConfigCache {
    /**
     * Constructor. Creates a ConfigCache class.
     *
     * @param {string} file
     * @param {boolean} debug
     */
    __construct(file, debug) {
        let checkers = [];
        if (debug) {
            checkers = [ new SelfCheckingResourceChecker() ];
        }

        super.__construct(file, checkers);
        this._debug = debug;
    }

    /**
     * @inheritdoc
     */
    isFresh() {
        if (! this._debug && existsSync(this._file)) {
            return true;
        }

        return super.isFresh();
    }
}
