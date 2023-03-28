const AnonymousToken = Jymfony.Component.Security.Authentication.Token.AnonymousToken;
const BinaryFileResponse = Jymfony.Component.HttpFoundation.BinaryFileResponse;
const ConcreteController = Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Controller.ConcreteController;
const Container = Jymfony.Component.DependencyInjection.Container;
const ContainerBag = Jymfony.Component.DependencyInjection.ParameterBag.ContainerBag;
const File = Jymfony.Component.HttpFoundation.File.File;
const FileNotFoundException = Jymfony.Component.HttpFoundation.File.Exception.FileNotFoundException;
const FrozenParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.FrozenParameterBag;
const JsonResponse = Jymfony.Component.HttpFoundation.JsonResponse;
const KernelTestUtil = Jymfony.Bundle.FrameworkBundle.Test.KernelTestUtil;
const Request = Jymfony.Component.HttpFoundation.Request;
const RedirectResponse = Jymfony.Component.HttpFoundation.RedirectResponse;
const Response = Jymfony.Component.HttpFoundation.Response;
const ResponseHeaderBag = Jymfony.Component.HttpFoundation.ResponseHeaderBag;
const Router = Jymfony.Component.Routing.Router;
const ServiceNotFoundException = Jymfony.Component.DependencyInjection.Exception.ServiceNotFoundException;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const TestAbstractController = Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Controller.TestAbstractController;
const TokenStorageInterface = Jymfony.Component.Security.Authentication.Token.Storage.TokenStorageInterface;
const UrlGeneratorInterface = Jymfony.Component.Routing.Generator.UrlGeneratorInterface;
const { basename } = require('path');

export default class AbstractControllerTest extends TestCase {
    createController() {
        return new TestAbstractController();
    }

    get defaultTimeout() {
        return 30000;
    }

    testShouldGenerateUrl() {
        const request = Request.create('/');
        const router = this.prophesize(Router);
        router.withContext(request).willReturn(router);
        router.generate('foo', {}, UrlGeneratorInterface.ABSOLUTE_PATH).willReturn('/foo');

        const container = new Container();
        container.set('router', router.reveal());

        const controller = this.createController();
        controller.container = container;

        __self.assertEquals('/foo', controller.generateUrl(request, 'foo'));
    }

    testGetParameterShouldWorkCorrectly() {
        const container = new Container(new FrozenParameterBag({ foo: 'bar' }));
        container.set('parameter_bag', new ContainerBag(container));

        const controller = this.createController();
        controller.container = container;

        __self.assertEquals('bar', controller.getParameter('foo'));
    }

    testShouldThrowIfParameterBagIsMissing() {
        const container = new Container();
        const controller = this.createController();
        controller.container = container;

        this.expectException(ServiceNotFoundException);
        controller.getParameter('foo');
    }

    async testShouldForwardRequests() {
        const request = Request.create('/');
        request.attributes.set('_locale', 'fr');
        request.setRequestFormat('xml');

        const handler = this.prophesize(Jymfony.Component.HttpServer.RequestHandler);
        handler.handle(request).will(req => {
            return new Response(req.getRequestFormat() + '--' + req.attributes.get('_locale'));
        });

        request.attributes.set('_handler', handler.reveal());

        const controller = this.createController();
        const response = await controller.forward(request, 'a_controller');

        __self.assertEquals('xml--fr', response.content);
    }

    testShouldReturnARedirectResponse() {
        const controller = this.createController();
        const response = controller.redirect('https://jymfony.io', 301);

        __self.assertInstanceOf(RedirectResponse, response);
        __self.assertEquals('https://jymfony.io', response.targetUrl);
        __self.assertEquals(301, response.statusCode);
    }

    testShouldReturnARedirectResponseToRoute() {
        const request = Request.create('/');
        const router = this.prophesize(Router);
        router.withContext(request).willReturn(router);
        router.generate('foo', {}, UrlGeneratorInterface.ABSOLUTE_PATH).willReturn('/foo');

        const container = new Container();
        container.set('router', router.reveal());

        const controller = this.createController();
        controller.container = container;

        const response = controller.redirectToRoute(request, 'foo');
        __self.assertInstanceOf(RedirectResponse, response);
        __self.assertEquals('/foo', response.targetUrl);
        __self.assertEquals(302, response.statusCode);
    }

    testJsonMethodShouldWork() {
        const controller = this.createController();

        let response = controller.json([]);
        __self.assertInstanceOf(JsonResponse, response);
        __self.assertEquals('[]', response.content);

        response = controller.json({});
        __self.assertInstanceOf(JsonResponse, response);
        __self.assertEquals('{}', response.content);
    }

    async testShouldReturnBinaryFileResponse() {
        const request = Request.create('/');
        const controller = this.createController();

        const response = controller.file(new File(__filename));
        await response.prepare(request);

        __self.assertInstanceOf(BinaryFileResponse, response);
        __self.assertEquals(200, response.statusCode);

        if (! __jymfony.Platform.isWindows() && response.headers.has('content-type')) {
            __self.assertEquals('text/plain', response.headers.get('content-type'));
        }

        __self.assertStringContainsString(ResponseHeaderBag.DISPOSITION_ATTACHMENT, response.headers.get('content-disposition'));
        __self.assertStringContainsString(basename(__filename), response.headers.get('content-disposition'));
    }

    async testShouldReturnBinaryFileResponseWithDispositionInline() {
        const request = Request.create('/');
        const controller = this.createController();

        const response = controller.file(new File(__filename), null, ResponseHeaderBag.DISPOSITION_INLINE);
        await response.prepare(request);

        __self.assertInstanceOf(BinaryFileResponse, response);
        __self.assertStringContainsString(ResponseHeaderBag.DISPOSITION_INLINE, response.headers.get('content-disposition'));
        __self.assertStringContainsString(basename(__filename), response.headers.get('content-disposition'));
    }

    async testShouldReturnBinaryFileResponseWithItsOwnFileName() {
        const request = Request.create('/');
        const controller = this.createController();

        const response = controller.file(new File(__filename), 'test.js');
        await response.prepare(request);

        __self.assertInstanceOf(BinaryFileResponse, response);
        __self.assertStringContainsString('test.js', response.headers.get('content-disposition'));
    }

    async testShouldReturnBinaryFileResponsePassingTheFilepath() {
        const request = Request.create('/');
        const controller = this.createController();

        const response = controller.file(__filename);
        await response.prepare(request);

        __self.assertInstanceOf(BinaryFileResponse, response);
        __self.assertEquals(200, response.statusCode);

        if (! __jymfony.Platform.isWindows() && response.headers.has('content-type')) {
            __self.assertEquals('text/plain', response.headers.get('content-type'));
        }

        __self.assertStringContainsString(ResponseHeaderBag.DISPOSITION_ATTACHMENT, response.headers.get('content-disposition'));
        __self.assertStringContainsString(basename(__filename), response.headers.get('content-disposition'));
    }

    async testShouldThrowIfFileDoesNotExist() {
        const controller = this.createController();
        this.expectException(FileNotFoundException);
        controller.file(__filename + 'xyz');
    }

    async testIsGrantedShouldThrowIfSecurityBundleIsNotRegistered() {
        const kernel = KernelTestUtil.createKernel({ kernelClass: 'Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Controller.TestKernel' });
        await kernel.boot();

        const controller = kernel.container.get(ConcreteController);

        this.expectException(LogicException);
        this.expectExceptionMessage('The SecurityBundle is not registered in your application. Try running "npm install @jymfony/security-bundle".');

        try {
            controller.isGranted(new Request('/'), 'ROLE_ADMIN');
        } finally {
            await kernel.shutdown();
        }
    }

    async testIsGrantedShouldReturnFalse() {
        const kernel = KernelTestUtil.createKernel({ kernelClass: 'Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Controller.TestKernelWithSecurity' });
        await kernel.boot();

        const request = new Request('/');
        const container = KernelTestUtil.getContainer(kernel);
        container.get(TokenStorageInterface).setToken(request, new AnonymousToken('secret'));

        const controller = container.get(ConcreteController);
        __self.assertFalse(controller.isGranted(request, 'ROLE_ADMIN'));

        await kernel.shutdown();
    }

    async testIsGrantedShouldReturnTrue() {
        const kernel = KernelTestUtil.createKernel({ kernelClass: 'Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Controller.TestKernelWithSecurity' });
        await kernel.boot();

        const request = new Request('/');
        const container = KernelTestUtil.getContainer(kernel);
        container.get(TokenStorageInterface).setToken(request, new AnonymousToken('secret'));

        const controller = container.get(ConcreteController);
        __self.assertTrue(controller.isGranted(request, 'IS_AUTHENTICATED_ANONYMOUSLY'));

        await kernel.shutdown();
    }

    async testRenderViewShouldThrowIfTemplatingIsNotAvailable() {
        const kernel = KernelTestUtil.createKernel({ kernelClass: 'Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Controller.TestKernel' });
        await kernel.boot();

        const controller = kernel.container.get(ConcreteController);

        this.expectException(LogicException);
        this.expectExceptionMessage('You can not use the "renderView" method if the Templating Component is not available. Try running "npm install @jymfony/templating".');

        try {
            await controller.renderView('');
        } finally {
            await kernel.shutdown();
        }
    }

    async testRenderViewShouldReturnTheRenderedTemplate() {
        const kernel = KernelTestUtil.createKernel({ kernelClass: 'Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Controller.TestKernelWithTemplating' });
        await kernel.boot();

        const controller = kernel.container.get(ConcreteController);
        const view = await controller.renderView(__dirname + '/../../fixtures/templates/foo.txt.js');

        __self.assertEquals('Hello world!\n', view);

        await kernel.shutdown();
    }

    async testRenderShouldThrowIfTemplatingIsDisabled() {
        const kernel = KernelTestUtil.createKernel({ kernelClass: 'Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Controller.TestKernel' });
        await kernel.boot();

        const controller = kernel.container.get(ConcreteController);

        this.expectException(LogicException);
        this.expectExceptionMessage('You can not use the "render" method if the Templating Component is not available. Try running "npm install @jymfony/templating".');

        try {
            controller.render('');
        } finally {
            await kernel.shutdown();
        }
    }

    async testRenderShouldReturnAResponseWithRenderingContent() {
        const kernel = KernelTestUtil.createKernel({ kernelClass: 'Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Controller.TestKernelWithTemplating' });
        await kernel.boot();

        const controller = kernel.container.get(ConcreteController);
        const response = await controller.render(__dirname + '/../../fixtures/templates/foo.txt.js');

        __self.assertInstanceOf(Response, response);

        const buffer = new __jymfony.StreamBuffer();
        await response.content(buffer);
        __self.assertEquals('Hello world!\n', buffer.buffer.toString('utf-8'));

        await kernel.shutdown();
    }
}
