const Kernel = Jymfony.Component.Kernel.Kernel;

class KernelForTest extends Kernel {
    /**
     * @returns {Object}
     */
    get bundleMap() {
        return this._bundleMap;
    }

    /**
     * @inheritdoc
     */
    registerBundles() {
        return [];
    }
}

module.exports = KernelForTest;
