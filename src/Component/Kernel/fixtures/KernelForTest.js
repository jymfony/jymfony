const Kernel = Jymfony.Component.Kernel.Kernel;

class KernelForTest extends Kernel {
    get bundleMap() {
        return this._bundleMap;
    }

    registerBundles() {
        return [];
    }

    get booted() {
        return this._booted;
    }
}

module.exports = KernelForTest;
