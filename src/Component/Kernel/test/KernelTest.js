const Namespace = Jymfony.Component.Autoloader.Namespace;
const DateTime = Jymfony.Component.DateTime.DateTime;
const Bundle = Jymfony.Component.Kernel.Bundle;
const Kernel = Jymfony.Component.Kernel.Kernel;

const expect = require('chai').expect;
const path = require('path');

const Fixtures = new Namespace(__jymfony.autoload, 'Jymfony.Component.Kernel.Fixtures', [
    path.join(__dirname, '..', 'fixtures')
]);

const getKernel = function (methods = [], bundles = []) {
    let kernel = new Kernel('test', false);
    kernel.getCallCount = function (method) {
        return ~~ (this._calls[method]);
    };

    kernel._calls = {
        'registerBundles': 0,
    };

    for (let method of methods) {
        kernel._calls[method] = 0;
        kernel[method] = function () {
            this._calls[method]++;
        };
    }

    kernel.registerBundles = function () {
        this._calls['registerBundles']++;

        return bundles;
    };

    return kernel;
};

const getKernelForTest = function (methods = [], bundles = []) {
    let kernel = new Fixtures.KernelForTest('test', false);
    kernel.getCallCount = function (method) {
        return ~~ (this._calls[method]);
    };

    kernel._calls = {
        'registerBundles': 0,
    };

    for (let method of methods) {
        kernel._calls[method] = 0;
        kernel[method] = function () {
            this._calls[method]++;
        };
    }

    kernel.registerBundles = function () {
        this._calls['registerBundles']++;

        return bundles;
    };

    return kernel;
};

describe('[Kernel] Kernel', function () {
    it('constructor', () => {
        let kernel = new Fixtures.KernelForTest('test_env', true);

        expect(kernel.environment).to.be.equal('test_env');
        expect(kernel.debug).to.be.true;
        expect(kernel.booted).to.be.false;
        expect(kernel.container).to.be.equal(undefined);
        expect(kernel.startTime.microtime <= DateTime.now.microtime).to.be.true;
    });

    it('boot should initialize bundles and container', () => {
        let kernel = getKernel(['_initializeBundles', '_initializeContainer']);
        kernel.boot();

        expect(kernel.getCallCount('_initializeBundles')).to.be.equal(1);
        expect(kernel.getCallCount('_initializeContainer')).to.be.equal(1);
    });

    it('boot sets the container to bundles', () => {
        let bundle = new Bundle;
        let container = undefined, called = false;
        bundle.setContainer = cont => { called = true; container = cont; };

        let kernel = getKernel(['_initializeBundles', '_initializeContainer']);
        kernel.getBundles = () => [bundle];
        kernel.boot();

        expect(container).to.be.equal(kernel.container);
        expect(called).to.be.true;
    });

    it('boot should set the booted flag', () => {
        let kernel = getKernelForTest(['_initializeBundles', '_initializeContainer']);
        kernel.boot();

        expect(kernel.booted).to.be.true;
    });

    it('boot should initialize bundles once if multiple boot has called', () => {
        let kernel = getKernel(['_initializeBundles', '_initializeContainer']);
        kernel.boot();
        kernel.boot();

        expect(kernel.getCallCount('_initializeBundles')).to.be.equal(1);
        expect(kernel.getCallCount('_initializeContainer')).to.be.equal(1);
    });

    it('shutdown should call shutdown on all bundles', () => {
        let bundle = new Bundle;
        let called = false;

        bundle.shutdown = () => { called = true; };

        let kernel = getKernel(['_initializeContainer'], [ bundle ]);

        kernel.boot();
        kernel.shutdown();

        expect(called).to.be.true;
    })
});
