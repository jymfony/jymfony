const crypto = require('crypto');
const os = require('os');
const path = require('path');

const ConfigCache = Jymfony.Component.Config.ConfigCache;
const FileLocator = Jymfony.Component.Config.FileLocator;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const ParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag;
const JsFileLoader = Jymfony.Component.DependencyInjection.Loader.JsFileLoader;
const Kernel = Jymfony.Component.Kernel.Kernel;

class TestKernel extends Kernel {
    /**
     * Constructor.
     *
     * @param {string} environment
     * @param {boolean} debug
     * @param {boolean} addTestCommands
     */
    __construct(environment, debug, addTestCommands) {
        /**
         * @type {boolean}
         * @private
         */
        this._addTestCommands = addTestCommands;

        let current_date = (new Date()).valueOf().toString();
        let random = Math.random().toString();

        this._prefixCacheLogDir = crypto.createHmac('sha1', current_date + random).update('logs_cache_prefix').digest('hex');
        super.__construct(environment, debug);
    }

    /**
     * @inheritDoc
     */
    getLogsDir() {
        return path.normalize(path.join(os.tmpdir(), 'jymfony_tests', this._prefixCacheLogDir, 'var', 'logs'));
    }

    /**
     * @inheritDoc
     */
    getCacheDir() {
        return path.normalize(path.join(os.tmpdir(), 'jymfony_tests', this._prefixCacheLogDir, 'var', 'cache'));
    }

    /**
     * @inheritDoc
     */
    _getContainerBuilder() {
        let container = new ContainerBuilder();

        if (this._addTestCommands) {
            let loader = new JsFileLoader(container, new FileLocator());
            loader.load(path.join(__dirname, 'js', 'services.js'));
        }

        container.parameterBag.add(this._getKernelParameters());

        return container;
    }

    /**
     * @inheritDoc
     */
    _initializeContainer() {
        let container;
        let class_ = this._getContainerClass();
        let cache = new ConfigCache(path.join(this.getCacheDir(), class_ + '.js'), this._debug);

        container = this._buildContainer();
        container.compile();

        this._dumpContainer(container, cache);

        container = new (require(cache.getPath()))();

        this._container = container;
        this._container.set('kernel', this);

        if (this._container.has('cache_warmer')) {
            this._container.get('cache_warmer').warmUp(this._container.getParameter('kernel.cache_dir'));
        }
    }
}

module.exports = TestKernel;
