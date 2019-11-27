require('../../fixtures/namespace');

const ConcreteController = Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Controller.ConcreteController;
const TestAbstractController = Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Controller.TestAbstractController;
const KernelTestUtil = Jymfony.Bundle.FrameworkBundle.Test.KernelTestUtil;
const Container = Jymfony.Component.DependencyInjection.Container;
const ServiceNotFoundException = Jymfony.Component.DependencyInjection.Exception.ServiceNotFoundException;
const ContainerBag = Jymfony.Component.DependencyInjection.ParameterBag.ContainerBag;
const FrozenParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.FrozenParameterBag;
const BinaryFileResponse = Jymfony.Component.HttpFoundation.BinaryFileResponse;
const FileNotFoundException = Jymfony.Component.HttpFoundation.File.Exception.FileNotFoundException;
const File = Jymfony.Component.HttpFoundation.File.File;
const JsonResponse = Jymfony.Component.HttpFoundation.JsonResponse;
const Request = Jymfony.Component.HttpFoundation.Request;
const RedirectResponse = Jymfony.Component.HttpFoundation.RedirectResponse;
const Response = Jymfony.Component.HttpFoundation.Response;
const ResponseHeaderBag = Jymfony.Component.HttpFoundation.ResponseHeaderBag;
const Router = Jymfony.Component.Routing.Router;
const UrlGeneratorInterface = Jymfony.Component.Routing.Generator.UrlGeneratorInterface;
const AnonymousToken = Jymfony.Component.Security.Authentication.Token.AnonymousToken;
const TokenStorageInterface = Jymfony.Component.Security.Authentication.Token.Storage.TokenStorageInterface;
const Prophet = Jymfony.Component.Testing.Prophet;
const { expect } = require('chai');
const { basename } = require('path');

const createController = () => new TestAbstractController();

describe('[FrameworkBundle] AbstractController', function () {
    if (! __jymfony.Platform.hasPublicFieldSupport()) {
        beforeEach(function () {
            this.skip();
        });
    }

    beforeEach(() => {
        this._prophet = new Prophet();
    });

    afterEach(() => {
        this._prophet.checkPredictions();
    });

    it ('should generate url', () => {
        const request = Request.create('/');
        const router = this._prophet.prophesize(Router);
        router.withContext(request).willReturn(router);
        router.generate('foo', {}, UrlGeneratorInterface.ABSOLUTE_PATH).willReturn('/foo');

        const container = new Container();
        container.set('router', router.reveal());

        const controller = createController();
        controller.container = container;

        expect(controller.generateUrl(request, 'foo')).to.be.equal('/foo');
    });

    it ('getParameter should work correctly', () => {
        const container = new Container(new FrozenParameterBag({ foo: 'bar' }));
        container.set('parameter_bag', new ContainerBag(container));

        const controller = createController();
        controller.container = container;

        expect(controller.getParameter('foo')).to.be.equal('bar');
    });

    it ('should throw if parameter bag is missing', () => {
        const container = new Container();
        const controller = createController();
        controller.container = container;

        expect(() => controller.getParameter('foo')).to.throw(ServiceNotFoundException);
    });

    it ('should forward requests', async () => {
        const request = Request.create('/');
        request.attributes.set('_locale', 'fr');
        request.setRequestFormat('xml');

        const handler = this._prophet.prophesize(Jymfony.Component.HttpServer.RequestHandler);
        handler.handle(request).will(req => {
            return new Response(req.getRequestFormat() + '--' + req.attributes.get('_locale'));
        });

        request.attributes.set('_handler', handler.reveal());

        const controller = createController();
        const response = await controller.forward(request, 'a_controller');

        expect(response.content).to.be.equal('xml--fr');
    });

    it ('should return a redirect response', () => {
        const controller = createController();
        const response = controller.redirect('https://jymfony.io', 301);

        expect(response).to.be.instanceOf(RedirectResponse);
        expect(response.targetUrl).to.be.equal('https://jymfony.io');
        expect(response.statusCode).to.be.equal(301);
    });

    it ('should return a redirect response to route', () => {
        const request = Request.create('/');
        const router = this._prophet.prophesize(Router);
        router.withContext(request).willReturn(router);
        router.generate('foo', {}, UrlGeneratorInterface.ABSOLUTE_PATH).willReturn('/foo');

        const container = new Container();
        container.set('router', router.reveal());

        const controller = createController();
        controller.container = container;

        const response = controller.redirectToRoute(request, 'foo');
        expect(response).to.be.instanceOf(RedirectResponse);
        expect(response.targetUrl).to.be.equal('/foo');
        expect(response.statusCode).to.be.equal(302);
    });

    it ('json method should work', () => {
        const controller = createController();

        let response = controller.json([]);
        expect(response).to.be.instanceOf(JsonResponse);
        expect(response.content).to.be.equal('[]');

        response = controller.json({});
        expect(response).to.be.instanceOf(JsonResponse);
        expect(response.content).to.be.equal('{}');
    });

    it ('should return binary file response', async () => {
        const request = Request.create('/');
        const controller = createController();

        const response = controller.file(new File(__filename));
        await response.prepare(request);

        expect(response).to.be.instanceOf(BinaryFileResponse);
        expect(response.statusCode).to.be.equal(200);

        if (! __jymfony.Platform.isWindows() && response.headers.has('content-type')) {
            expect(response.headers.get('content-type')).to.be.equal('text/plain');
        }

        expect(response.headers.get('content-disposition')).to.contain(ResponseHeaderBag.DISPOSITION_ATTACHMENT);
        expect(response.headers.get('content-disposition')).to.contain(basename(__filename));
    });

    it ('should return binary file response with disposition inline', async () => {
        const request = Request.create('/');
        const controller = createController();

        const response = controller.file(new File(__filename), null, ResponseHeaderBag.DISPOSITION_INLINE);
        await response.prepare(request);

        expect(response).to.be.instanceOf(BinaryFileResponse);
        expect(response.headers.get('content-disposition')).to.contain(ResponseHeaderBag.DISPOSITION_INLINE);
        expect(response.headers.get('content-disposition')).to.contain(basename(__filename));
    });

    it ('should return binary file response with its own file name', async () => {
        const request = Request.create('/');
        const controller = createController();

        const response = controller.file(new File(__filename), 'test.js');
        await response.prepare(request);

        expect(response).to.be.instanceOf(BinaryFileResponse);
        expect(response.headers.get('content-disposition')).to.contain('test.js');
    });

    it ('should return binary file response passing the filepath', async () => {
        const request = Request.create('/');
        const controller = createController();

        const response = controller.file(__filename);
        await response.prepare(request);

        expect(response).to.be.instanceOf(BinaryFileResponse);
        expect(response.statusCode).to.be.equal(200);

        if (! __jymfony.Platform.isWindows() && response.headers.has('content-type')) {
            expect(response.headers.get('content-type')).to.be.equal('text/plain');
        }

        expect(response.headers.get('content-disposition')).to.contain(ResponseHeaderBag.DISPOSITION_ATTACHMENT);
        expect(response.headers.get('content-disposition')).to.contain(basename(__filename));
    });

    it ('should throw if file does not exist', async () => {
        const controller = createController();
        expect(() => controller.file(__filename + 'xyz')).to.throw(FileNotFoundException);
    });

    it ('isGranted should throw if security bundle is not registered', async () => {
        const kernel = KernelTestUtil.createKernel({ kernelClass: 'Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Controller.TestKernel' });
        await kernel.boot();

        const controller = kernel.container.get(ConcreteController);
        expect(() => controller.isGranted(new Request('/'), 'ROLE_ADMIN')).to.throw(
            LogicException,
            /The SecurityBundle is not registered in your application\. Try running "yarn add @jymfony\/security-bundle/
        );

        await kernel.shutdown();
    });

    it ('isGranted should return false', async () => {
        const kernel = KernelTestUtil.createKernel({ kernelClass: 'Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Controller.TestKernelWithSecurity' });
        await kernel.boot();

        const request = new Request('/');
        const container = KernelTestUtil.getContainer(kernel);
        container.get(TokenStorageInterface).setToken(request, new AnonymousToken('secret'));

        const controller = container.get(ConcreteController);
        expect(controller.isGranted(request, 'ROLE_ADMIN')).to.be.false;

        await kernel.shutdown();
    });
});
