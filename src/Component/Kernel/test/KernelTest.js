const Namespace = Jymfony.Component.Autoloader.Namespace;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const DateTime = Jymfony.Component.DateTime.DateTime;
const Bundle = Jymfony.Component.Kernel.Bundle;
const Kernel = Jymfony.Component.Kernel.Kernel;
const Argument = Jymfony.Component.Testing.Argument.Argument;
const Prophet = Jymfony.Component.Testing.Prophet;

const expect = require('chai').expect;
const path = require('path');

const Fixtures = new Namespace(__jymfony.autoload, 'Jymfony.Component.Kernel.Fixtures', [
    path.join(__dirname, '..', 'fixtures'),
]);

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

    getCallCount(method) {
        return ~~this._calls[method];
    }

    registerBundles() {
        this._calls['registerBundles']++;

        return this._registeredBundles;
    }
}

const getKernel = function (methods = [], bundles = []) {
    return new CallTracingKernel(methods, bundles);
};

/**
 * @type {Jymfony.Component.Testing.Prophet}
 */
let prophet;

describe('[Kernel] Kernel', function () {
    beforeEach(() => {
        prophet = new Prophet();
    });

    afterEach(() => {
        prophet.checkPredictions();
    });

    it('constructor', () => {
        const kernel = new Fixtures.KernelForTest('test_env', true);

        expect(kernel.environment).to.be.equal('test_env');
        expect(kernel.debug).to.be.true;
        expect(kernel.booted).to.be.false;
        expect(kernel.container).to.be.equal(undefined);
        expect(kernel.startTime.microtime <= DateTime.now.microtime).to.be.true;
    });

    it('boot should initialize bundles and container', () => {
        const kernel = getKernel([ '_initializeBundles', '_initializeContainer' ]);
        kernel.boot();

        expect(kernel.getCallCount('_initializeBundles')).to.be.equal(1);
        expect(kernel.getCallCount('_initializeContainer')).to.be.equal(1);
    });

    it('boot sets the container to bundles', async () => {
        const bundle = prophet.prophesize(Bundle);
        bundle.setContainer(Argument.any()).willReturn();
        bundle.boot().willReturn();

        const kernel = getKernel([ '_initializeBundles', '_initializeContainer' ], [ bundle.reveal() ]);
        await kernel.boot();

        bundle.setContainer(kernel.container).shouldHaveBeenCalled();
    });

    it('boot should set the booted flag', () => {
        const kernel = getKernel([ '_initializeBundles', '_initializeContainer' ]);
        kernel.boot();

        expect(kernel._booted).to.be.true;
    });

    it('boot should initialize bundles once if multiple boot has called', async () => {
        const kernel = getKernel([ '_initializeBundles', '_initializeContainer' ]);
        await kernel.boot();
        await kernel.boot();

        expect(kernel.getCallCount('_initializeBundles')).to.be.equal(1);
        expect(kernel.getCallCount('_initializeContainer')).to.be.equal(1);
    });

    it('shutdown should call shutdown on all bundles', async () => {
        const bundle = prophet.prophesize(Bundle);
        const kernel = getKernel([ '_initializeContainer' ], [ bundle.reveal() ]);
        kernel._container = new ContainerBuilder();

        await kernel.boot();
        await kernel.shutdown();

        bundle.shutdown().shouldHaveBeenCalled();
    });
});
