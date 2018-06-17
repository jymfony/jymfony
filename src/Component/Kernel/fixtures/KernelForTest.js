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

    /**
     * @returns {boolean}
     */
    get booted() {
        return this._booted;
    }
}

module.exports = KernelForTest;
