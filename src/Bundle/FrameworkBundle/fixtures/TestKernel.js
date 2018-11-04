const FileLocator = Jymfony.Component.Config.FileLocator;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const JsFileLoader = Jymfony.Component.DependencyInjection.Loader.JsFileLoader;
const Kernel = Jymfony.Component.Kernel.Kernel;

const crypto = require('crypto');
const os = require('os');
const path = require('path');

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
         *
         * @private
         */
        this._addTestCommands = addTestCommands;

        const current_date = (new Date()).valueOf().toString();
        const random = Math.random().toString();

        this._prefixCacheLogDir = crypto.createHmac('sha1', current_date + random).update('logs_cache_prefix').digest('hex');
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
        return path.normalize(path.join(os.tmpdir(), 'jymfony_tests', this._prefixCacheLogDir, 'var', 'logs'));
    }

    /**
     * @inheritdoc
     */
    getCacheDir() {
        return path.normalize(path.join(os.tmpdir(), 'jymfony_tests', this._prefixCacheLogDir, 'var', 'cache'));
    }

    /**
     * @inheritdoc
     */
    _getContainerBuilder() {
        const container = new ContainerBuilder();

        if (this._addTestCommands) {
            const loader = new JsFileLoader(container, new FileLocator());
            loader.load(path.join(__dirname, 'js', 'services.js'));
        }

        container.parameterBag.add(this._getKernelParameters());

        return container;
    }

    /**
     * @inheritdoc
     */
    _initializeContainer() {
        super._initializeContainer(true);
    }
}

module.exports = TestKernel;
