import { join } from 'path';

const AbstractTestKernel = Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.AbstractTestKernel;
const FileLocator = Jymfony.Component.Config.FileLocator;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const JsFileLoader = Jymfony.Component.DependencyInjection.Loader.JsFileLoader;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.Tests.Fixtures
 */
export default class TestKernel extends AbstractTestKernel {
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

        super.__construct(environment, debug);
    }

    /**
     * @inheritdoc
     */
    _getContainerBuilder() {
        const container = new ContainerBuilder();

        if (this._addTestCommands) {
            const loader = new JsFileLoader(container, new FileLocator());
            loader.load(join(__dirname, 'js', 'services.js'));
        }

        container.parameterBag.add(this._getKernelParameters());

        return container;
    }
}
