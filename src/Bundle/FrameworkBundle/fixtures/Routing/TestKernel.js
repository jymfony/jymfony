const AbstractTestKernel = Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.AbstractTestKernel;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Routing
 */
export default class TestKernel extends AbstractTestKernel {
    /**
     * @inheritdoc
     */
    _configureContainer(container, loader) {
        loader.load(__dirname + '/config.json');
    }
}
