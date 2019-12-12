const TestKernel = Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Controller.TestKernel;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Controller
 */
export default class TestKernelWithSecurity extends TestKernel {
    /**
     * @inheritdoc
     */
    * registerBundles() {
        yield new Jymfony.Bundle.FrameworkBundle.FrameworkBundle();
        yield new Jymfony.Bundle.SecurityBundle.SecurityBundle();
    }

    /**
     * @inheritdoc
     */
    _configureContainer(container, loader) {
        loader.load(__dirname + '/config_security.json');
    }
}
