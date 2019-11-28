import {tmpdir} from "os";
import {join, normalize} from 'path';

const TestKernel = Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Controller.TestKernel;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Controller
 */
export default class TestKernelWithTemplating extends TestKernel {
    /**
     * @inheritdoc
     */
    getCacheDir() {
        return normalize(join(__dirname, 'jymfony_tests', this._prefixCacheLogDir, 'var', 'cache'));
    }

    /**
     * @inheritdoc
     */
    _configureContainer(container, loader) {
        loader.load(__dirname + '/config_templating.json');
    }
}
