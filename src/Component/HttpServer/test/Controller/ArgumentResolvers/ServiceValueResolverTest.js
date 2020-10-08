const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const ServiceNotFoundException = Jymfony.Component.DependencyInjection.Exception.ServiceNotFoundException;
const ServiceLocator = Jymfony.Component.DependencyInjection.ServiceLocator;
const Request = Jymfony.Component.HttpFoundation.Request;
const ServiceValueResolver = Jymfony.Component.HttpServer.Controller.ArgumentResolvers.ServiceValueResolver;
const RegisterControllerArgumentLocatorsPass = Jymfony.Component.HttpServer.DependencyInjection.RegisterControllerArgumentLocatorsPass;
const Fixtures = Jymfony.Component.HttpServer.Tests.Fixtures.ArgumentResolver;
const { expect } = require('chai');

class DummyService { }

describe('[HttpServer] ServiceValueResolver', function () {
    const requestWithAttributes = (attributes) => {
        const request = Request.create('/');

        for (const [ name, value ] of __jymfony.getEntries(attributes)) {
            request.attributes.set(name, value);
        }

        return request;
    };

    it ('should not support not registered controllers', () => {
        const resolver = new ServiceValueResolver(new ServiceLocator({}));
        const request = requestWithAttributes({ _controller: 'my_controller' });

        expect(resolver.supports(request, {})).to.be.equal(false);
    });

    it ('should yield services for registered controller', () => {
        const resolver = new ServiceValueResolver(new ServiceLocator({
            'App.Controller.Mine:method': () => new ServiceLocator({
                dummy: () => new DummyService(),
            }),
        }));

        const request = requestWithAttributes({ _controller: 'App.Controller.Mine:method' });

        const argument = { name: 'dummy' };
        expect(resolver.supports(request, argument)).to.be.equal(true);
        expect([ ...resolver.resolve(request, argument) ][0]).to.be.instanceOf(DummyService);
    });

    it ('should throw error', async () => {
        const container = new ContainerBuilder();
        container.addCompilerPass(new RegisterControllerArgumentLocatorsPass());

        container.register('argument_resolver.service', ServiceValueResolver).addArgument(null).setPublic(true);
        container.register('DummyController', Fixtures.Controller).addTag('controller.service_arguments').setPublic(true);

        container.compile();

        const request = requestWithAttributes({ _controller: 'DummyController:index' });
        try {
            [ ...await (container.get('argument_resolver.service').resolve(request, { name: 'dummy' })) ].reverse();

            throw new Error();
        } catch (e) {
            expect(e).to.be.instanceof(ServiceNotFoundException);
            expect(e.message).to.match(
                /Cannot resolve argument dummy of "DummyController:index\(\)": Service "DummyController:index" not found: the current service locator only knows about the "DummyController:controllerWithRequest", "DummyController:controllerWithRequestInterface", "DummyController:controllerWithSession" and "DummyController:fooAction" services\. Unless you need extra laziness, try using dependency injection instead, otherwise, you need to declare it using getSubscribedServices\(\)/
            );
        }
    });
});
