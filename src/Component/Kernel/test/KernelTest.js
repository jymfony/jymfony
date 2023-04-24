const Argument = Jymfony.Component.Testing.Argument.Argument;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const Bundle = Jymfony.Component.Kernel.Bundle;
const DateTime = Jymfony.Component.DateTime.DateTime;
const Filesystem = Jymfony.Component.Filesystem.Filesystem;
const Fixtures = Jymfony.Component.Kernel.Fixtures;
const Kernel = Jymfony.Component.Kernel.Kernel;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

class CallTracingKernel extends Kernel {
    __construct(methods = [], bundles = []) {
        super.__construct('test', false);

        this._calls = {
            'registerBundles': 0,
        };

        for (const method of methods) {
            this._calls[method] = 0;
            this[method] = function () {
                this._calls[method]++;
            };
        }

        this._registeredBundles = bundles;
        this._bundles = bundles;
    }

    async boot() {
        await super.boot();
        this._container = this._container || { shutdown() {} };
    }

    getCallCount(method) {
        return ~~this._calls[method];
    }

    registerBundles() {
        this._calls['registerBundles']++;

        return this._registeredBundles;
    }
}

export default class KernelTest extends TestCase {
    _kernel;

    get testCaseName() {
        return '[Kernel] ' + super.testCaseName;
    }

    async afterEach() {
        if (undefined !== this._kernel) {
            await this._kernel.shutdown();
        }

        this._kernel = undefined;
    }

    async after() {
        const fs = new Filesystem();
        await fs.remove(__dirname + '/../var');
    }

    getKernel(methods = [], bundles = []) {
        return this._kernel = new CallTracingKernel(methods, bundles);
    }

    testConstructor() {
        const kernel = new Fixtures.KernelForTest('test_env', true);

        __self.assertEquals('test_env', kernel.environment);
        __self.assertTrue(kernel.debug);
        __self.assertFalse(kernel.booted);
        __self.assertUndefined(kernel.container);
        __self.assertGreaterThanOrEqual(kernel.startTime.microtime, DateTime.now.microtime);
    }

    async testBootShouldInitializeBundlesAndContainer() {
        const kernel = this.getKernel([ '_initializeBundles', '_initializeContainer' ]);
        await kernel.boot();

        __self.assertEquals(1, kernel.getCallCount('_initializeBundles'));
        __self.assertEquals(1, kernel.getCallCount('_initializeContainer'));
    }

    async testBootSetsTheContainerToBundles() {
        const bundle = this.prophesize(Bundle);
        bundle.setContainer(Argument.any()).willReturn();
        bundle.boot().willReturn();
        bundle.path().willReturn();
        bundle.getNamespace().willReturn();
        bundle.getContainerExtension().willReturn();
        bundle.build(Argument.any()).willReturn();
        bundle.shutdown().willReturn();

        const kernel = this.getKernel([ '_initializeBundles' ], [ bundle.reveal() ]);
        await kernel.boot();

        bundle.setContainer(kernel.container).shouldHaveBeenCalled();
    }

    async testBootShouldSetTheBootedFlag() {
        const kernel = this.getKernel([ '_initializeBundles', '_initializeContainer' ]);
        await kernel.boot();

        __self.assertTrue(kernel._booted);
    }

    async testBootShouldInitializeBundlesOnceIfMultipleBootHasCalled() {
        const kernel = this.getKernel([ '_initializeBundles', '_initializeContainer' ]);
        await kernel.boot();
        await kernel.boot();

        __self.assertEquals(1, kernel.getCallCount('_initializeBundles'));
        __self.assertEquals(1, kernel.getCallCount('_initializeContainer'));
    }

    async testShutdownShouldCallShutdownOnAllBundles() {
        const bundle = this.prophesize(Bundle);
        const kernel = this.getKernel([ '_initializeContainer' ], [ bundle.reveal() ]);
        kernel._container = new ContainerBuilder();

        await kernel.boot();
        await kernel.shutdown();

        bundle.shutdown().shouldHaveBeenCalled();
    }
}
