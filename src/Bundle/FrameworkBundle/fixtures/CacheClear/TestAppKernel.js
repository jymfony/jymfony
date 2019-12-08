const AbstractTestKernel = Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.AbstractTestKernel;

export default class TestAppKernel extends AbstractTestKernel {
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
