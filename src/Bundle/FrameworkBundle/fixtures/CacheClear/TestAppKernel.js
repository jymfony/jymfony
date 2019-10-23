const FrameworkBundle = Jymfony.Bundle.FrameworkBundle.FrameworkBundle;
const Kernel = Jymfony.Component.Kernel.Kernel;

export default class TestAppKernel extends Kernel {
    /**
     * @inheritdoc
     */
    registerBundles() {
        return [
            new FrameworkBundle(),
        ];
    }

    /**
     * @inheritdoc
     */
    getCacheDir() {
        return this.getProjectDir() + '/cache';
    }

    /**
     * @inheritdoc
     */
    getLogsDir() {
        return this.getProjectDir() + '/logs';
    }

    /**
     * @inheritdoc
     */
    getProjectDir() {
        return __dirname + '/test';
    }

    /**
     * @inheritdoc
     */
    registerContainerConfiguration(loader) {
        loader.load(__dirname + '/config.json');
    }

    /**
     * @inheritdoc
     */
    _build(container) {
        container.register('logger', Jymfony.Component.Logger.NullLogger);
    }
}
