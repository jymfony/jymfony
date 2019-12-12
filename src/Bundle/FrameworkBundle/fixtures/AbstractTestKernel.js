import { join, normalize } from 'path';
import { createHmac } from 'crypto';
import { tmpdir } from 'os';

const Kernel = Jymfony.Component.Kernel.Kernel;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.Tests.Fixtures
 *
 * @abstract
 */
export default class AbstractTestKernel extends Kernel {
    /**
     * Constructor.
     *
     * @param {string} environment
     * @param {boolean} debug
     */
    __construct(environment, debug) {
        const current_date = (new Date()).valueOf().toString();
        const random = Math.random().toString();

        this._prefixCacheLogDir = createHmac('sha1', current_date + random).update('logs_cache_prefix').digest('hex');
        super.__construct(environment, debug);
    }

    /**
     * @inheritdoc
     */
    * registerBundles() {
        yield new Jymfony.Bundle.FrameworkBundle.FrameworkBundle();
    }

    /**
     * @inheritdoc
     */
    getLogsDir() {
        return normalize(join(tmpdir(), 'jymfony_tests', this._prefixCacheLogDir, 'var', 'logs'));
    }

    /**
     * @inheritdoc
     */
    getCacheDir() {
        return normalize(join(tmpdir(), 'jymfony_tests', this._prefixCacheLogDir, 'var', 'cache'));
    }

    /**
     * @inheritdoc
     */
    _initializeContainer() {
        super._initializeContainer(true);
    }
}
