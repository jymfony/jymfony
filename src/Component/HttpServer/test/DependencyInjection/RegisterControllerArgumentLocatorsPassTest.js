const ServiceClosureArgument = Jymfony.Component.DependencyInjection.Argument.ServiceClosureArgument;
const Container = Jymfony.Component.DependencyInjection.Container;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const InvalidArgumentException = Jymfony.Component.DependencyInjection.Exception.InvalidArgumentException;
const Reference = Jymfony.Component.DependencyInjection.Reference;
const RegisterControllerArgumentLocatorsPass = Jymfony.Component.HttpServer.DependencyInjection.RegisterControllerArgumentLocatorsPass;
const RegisterControllers = Jymfony.Component.HttpServer.Tests.Fixtures.RegisterControllers;
const { expect } = require('chai');

describe('[HttpServer] RegisterControllerArgumentLocatorsPass', () => {
    it ('should throw on invalid class', () => {
        const container = new ContainerBuilder();
        container.register('argument_resolver.service').addArgument([]);

        container.register('foo', 'Jymfony.Component.HttpServer.Tests.Fixtures.NotFound')
            .addTag('controller.service_arguments')
        ;

        const pass = new RegisterControllerArgumentLocatorsPass();
        expect(() => pass.process(container)).to.throw(
            InvalidArgumentException,
            /Class "Jymfony.Component.HttpServer.Tests.Fixtures.NotFound" used for service "foo" cannot be found./
        );
    });

    it ('should throw if action attribute is missing from tag', () => {
        const container = new ContainerBuilder();
        container.register('argument_resolver.service').addArgument([]);

        container.register('foo', RegisterControllers.RegisterTestController)
            .addTag('controller.service_arguments', { argument: 'bar' })
        ;

        const pass = new RegisterControllerArgumentLocatorsPass();
        expect(() => pass.process(container)).to.throw(
            InvalidArgumentException,
            /Missing "action" attribute on tag "controller.service_arguments" \{"argument":"bar"\} for service "foo"\./
        );
    });

    it ('should throw if argument attribute is missing from tag', () => {
        const container = new ContainerBuilder();
        container.register('argument_resolver.service').addArgument([]);

        container.register('foo', RegisterControllers.RegisterTestController)
            .addTag('controller.service_arguments', { action: 'fooAction' })
        ;

        const pass = new RegisterControllerArgumentLocatorsPass();
        expect(() => pass.process(container)).to.throw(
            InvalidArgumentException,
            /Missing "argument" attribute on tag "controller.service_arguments" \{"action":"fooAction"\} for service "foo"\./
        );
    });

    it ('should throw if service attribute is missing from tag', () => {
        const container = new ContainerBuilder();
        container.register('argument_resolver.service').addArgument([]);

        container.register('foo', RegisterControllers.RegisterTestController)
            .addTag('controller.service_arguments', { action: 'fooAction', argument: 'bar' })
        ;

        const pass = new RegisterControllerArgumentLocatorsPass();
        expect(() => pass.process(container)).to.throw(
            InvalidArgumentException,
            /Missing "id" attribute on tag "controller.service_arguments" \{"action":"fooAction","argument":"bar"\} for service "foo"\./
        );
    });

    it ('should throw on invalid method', __jymfony.Platform.hasPrivateMethodsSupport() ? () => {
        const container = new ContainerBuilder();
        container.register('argument_resolver.service').addArgument([]);

        container.register('foo', RegisterControllers.RegisterTestControllerWithPrivateMethod)
            .addTag('controller.service_arguments', { action: 'barAction', argument: 'bar', id: 'bar_service' })
        ;

        const pass = new RegisterControllerArgumentLocatorsPass();
        expect(() => pass.process(container)).to.throw(
            InvalidArgumentException,
            /Invalid "action" attribute on tag "controller\.service_arguments" for service "foo": no public "barAction\(\)" method found on class "Jymfony\.Component\.HttpServer\.Tests\.Fixtures\.RegisterControllers\.RegisterTestControllerWithPrivateMethod"\./
        );
    } : undefined);

    it ('should throw on invalid argument', () => {
        const container = new ContainerBuilder();
        container.register('argument_resolver.service').addArgument([]);

        container.register('foo', RegisterControllers.RegisterTestController)
            .addTag('controller.service_arguments', { action: 'fooAction', argument: 'baz', id: 'bar' })
        ;

        const pass = new RegisterControllerArgumentLocatorsPass();
        expect(() => pass.process(container)).to.throw(
            InvalidArgumentException,
            /Invalid "controller.service_arguments" tag for service "foo": method "fooAction\(\)" has no "baz" argument on class "Jymfony\.Component\.HttpServer\.Tests\.Fixtures\.RegisterControllers\.RegisterTestController"\./
        );
    });

    it ('should work', () => {
        const container = new ContainerBuilder();
        const resolver = container.register('argument_resolver.service').addArgument([]);

        container.register('foo', RegisterControllers.RegisterTestController)
            .addTag('controller.service_arguments')
        ;

        const pass = new RegisterControllerArgumentLocatorsPass();
        pass.process(container);

        let locator = container.getDefinition(resolver.getArgument(0).toString()).getArgument(0);

        expect(Object.keys(locator)).to.be.deep.equal([ 'foo:fooAction' ]);
        expect(locator['foo:fooAction']).to.be.instanceOf(ServiceClosureArgument);

        locator = container.getDefinition(locator['foo:fooAction'].values[0].toString());

        expect(locator.getClass()).to.be.equal('Jymfony.Component.DependencyInjection.ServiceLocator');
        expect(locator.isPublic()).to.be.equal(false);

        const expected = {
            bar: new ServiceClosureArgument(new Reference('Jymfony.Component.HttpServer.Tests.Fixtures.RegisterControllers.ControllerDummy', Container.IGNORE_ON_INVALID_REFERENCE)),
        };
        expect(locator.getArgument(0)).to.be.deep.equal(expected);
    });

    it ('should load explicit argument', () => {
        const container = new ContainerBuilder();
        const resolver = container.register('argument_resolver.service').addArgument([]);

        container.register('foo', RegisterControllers.RegisterTestController)
            .addTag('controller.service_arguments', { action: 'fooAction', argument: 'bar', id: 'bar' })
            .addTag('controller.service_arguments', { action: 'fooAction', argument: 'bar', id: 'baz' }) // Should be ignored, the first wins
        ;

        const pass = new RegisterControllerArgumentLocatorsPass();
        pass.process(container);

        let locator = container.getDefinition(resolver.getArgument(0).toString()).getArgument(0);
        locator = container.getDefinition(locator['foo:fooAction'].values[0].toString());

        const expected = {
            bar: new ServiceClosureArgument(new Reference('Jymfony.Component.HttpServer.Tests.Fixtures.RegisterControllers.ControllerDummy', Container.IGNORE_ON_INVALID_REFERENCE)),
        };
        expect(locator.getArgument(0)).to.be.deep.equal(expected);
    });

    it ('should load optional argument', () => {
        const container = new ContainerBuilder();
        const resolver = container.register('argument_resolver.service').addArgument([]);

        container.register('foo', RegisterControllers.RegisterTestController)
            .addTag('controller.service_arguments', { action: 'fooAction', argument: 'bar', id: '?bar' })
        ;

        const pass = new RegisterControllerArgumentLocatorsPass();
        pass.process(container);

        let locator = container.getDefinition(resolver.getArgument(0).toString()).getArgument(0);
        locator = container.getDefinition(locator['foo:fooAction'].values[0].toString());

        const expected = {
            bar: new ServiceClosureArgument(new Reference('Jymfony.Component.HttpServer.Tests.Fixtures.RegisterControllers.ControllerDummy', Container.IGNORE_ON_INVALID_REFERENCE)),
        };
        expect(locator.getArgument(0)).to.be.deep.equal(expected);
    });

    it ('should throw on non-existent type', () => {
        const container = new ContainerBuilder();
        container.register('argument_resolver.service').addArgument([]);

        container.register('foo', RegisterControllers.NonExistentClassController)
            .addTag('controller.service_arguments');

        const pass = new RegisterControllerArgumentLocatorsPass();
        expect(() => pass.process(container)).to.throw(
            InvalidArgumentException,
            /Cannot determine controller argument for "Jymfony\.Component\.HttpServer\.Tests\.Fixtures\.RegisterControllers\.NonExistentClassController:fooAction\(\)": the bar argument is type-hinted with the non-existent class or interface: "Jymfony\.Component\.HttpServer\.Tests\.Fixtures\.RegisterControllers\.NonExistentClass"\./
        );
    });

    it ('should throw on non-existent type on optional argument', () => {
        const container = new ContainerBuilder();
        const resolver = container.register('argument_resolver.service').addArgument([]);

        container.register('foo', RegisterControllers.NonExistentClassOptionalController)
            .addTag('controller.service_arguments');

        const pass = new RegisterControllerArgumentLocatorsPass();
        pass.process(container);

        const locator = container.getDefinition(resolver.getArgument(0).toString()).getArgument(0);
        expect(Object.keys(locator)).to.be.deep.equal([]);
    });

    it ('should make controllers public', () => {
        const container = new ContainerBuilder();
        container.register('argument_resolver.service').addArgument([]);

        container.register('foo', RegisterControllers.RegisterTestController)
            .setPublic(false)
            .addTag('controller.service_arguments');

        const pass = new RegisterControllerArgumentLocatorsPass();
        pass.process(container);

        expect(container.getDefinition('foo').isPublic()).to.be.equal(true);
    });
});
