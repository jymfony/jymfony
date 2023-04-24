const KernelTestUtil = Jymfony.Bundle.FrameworkBundle.Test.KernelTestUtil;
const Route = Jymfony.Component.Routing.Route;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class AnnotatedControllerLoaderTest extends TestCase {
    get testCaseName() {
        return '[FrameworkBundle] ' + super.testCaseName;
    }

    async testLoad() {
        const kernel = KernelTestUtil.createKernel({ kernelClass: 'Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Routing.TestKernel' });
        await kernel.boot();

        /** @type {Jymfony.Component.Routing.Router} */
        const router = kernel.container.get('router');
        __self.assertCount(2, router.routeCollection);

        const first = router.routeCollection.get('jymfony_framework_tests_fixtures_routing_annotated_first');
        __self.assertInstanceOf(Route, first);
        __self.assertEquals('/this/is/first/action', first.path);
        __self.assertEquals('Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Routing.AnnotatedController:firstAction', first.defaults._controller);
    }
}
