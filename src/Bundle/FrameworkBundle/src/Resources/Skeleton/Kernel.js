const BaseKernel = Jymfony.Component.Kernel.Kernel;

export default class Kernel extends BaseKernel {
    /**
     * @inheritdoc
     */
    * registerBundles() {
        yield new Jymfony.Bundle.FrameworkBundle.FrameworkBundle();
    }
}
