const BaseKernel = Jymfony.Component.Kernel.Kernel;

class Kernel extends BaseKernel {
    /**
     * @inheritdoc
     */
    * registerBundles() {
        yield new Jymfony.Bundle.FrameworkBundle.FrameworkBundle();
    }
}

module.exports = Kernel;
