const TestKernel = Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Controller.TestKernel;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Controller
 */
export default class TestKernelWithSecurity extends TestKernel {
    /**
     * @inheritdoc
     */
    _configureContainer(container, loader) {
        loader.load(__dirname + '/config_typed.json');
    }
}
