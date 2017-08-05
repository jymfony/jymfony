const BaseKernel = Jymfony.Component.Kernel.Kernel;

class Kernel extends BaseKernel {
    /**
     * @inheritDoc
     */
    * registerBundles() {
        yield new Jymfony.Bundle.FrameworkBundle.FrameworkBundle();
    }
}

module.exports = Kernel;
