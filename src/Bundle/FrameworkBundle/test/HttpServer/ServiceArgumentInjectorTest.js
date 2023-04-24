const KernelTestUtil = Jymfony.Bundle.FrameworkBundle.Test.KernelTestUtil;
const Request = Jymfony.Component.HttpFoundation.Request;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class ServiceArgumentInjectorTest extends TestCase {
    get testCaseName() {
        return '[Framework] ' + super.testCaseName;
    }

    async testServicesAreInjectedIntoController() {
        const kernel = KernelTestUtil.createKernel({ kernelClass: 'Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Controller.TestKernelWithTypedController' });
        await kernel.boot();

        /**
         * @type {Jymfony.Component.HttpServer.RequestHandler}
         */
        const handler = kernel.container.get('Jymfony.Component.HttpServer.RequestHandler');
        const response = await handler.handle(new Request('http://localhost/first'));

        __self.assertEquals([
            'Jymfony.Component.EventDispatcher.EventDispatcher',
            'Jymfony.Component.HttpFoundation.Request',
        ], JSON.parse(response.content));

        await kernel.shutdown();
    }
}
