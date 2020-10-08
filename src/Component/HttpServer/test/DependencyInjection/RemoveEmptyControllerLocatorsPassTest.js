const ResolveInvalidReferencesPass = Jymfony.Component.DependencyInjection.Compiler.ResolveInvalidReferencesPass;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const Reference = Jymfony.Component.DependencyInjection.Reference;
const RegisterControllerArgumentLocatorsPass = Jymfony.Component.HttpServer.DependencyInjection.RegisterControllerArgumentLocatorsPass;
const RemoveEmptyControllerArgumentLocatorsPass = Jymfony.Component.HttpServer.DependencyInjection.RemoveEmptyControllerArgumentLocatorsPass;
const EmptyLocators = Jymfony.Component.HttpServer.Tests.Fixtures.EmptyLocators;
const { expect } = require('chai');

describe('[HttpServer] RemoveEmptyControllerArgumentLocatorsPass', function () {
    it ('process should work', () => {
        const container = new ContainerBuilder();
        const resolver = container.register('argument_resolver.service').addArgument([]);

        container.register(Object);
        container.register('c1', EmptyLocators.RemoveTestController1).addTag('controller.service_arguments');
        container.register('c2', EmptyLocators.RemoveTestController2).addTag('controller.service_arguments')
            .addMethodCall('setSuite', [ new Reference('c1') ]);

        const pass = new RegisterControllerArgumentLocatorsPass();
        pass.process(container);

        let controllers = container.getDefinition(resolver.getArgument(0).toString()).getArgument(0);

        expect(Object.keys(container.getDefinition(controllers['c1:fooAction'].values[0].toString()).getArgument(0))).to.have.length(2);
        expect(Object.keys(container.getDefinition(controllers['c2:fooAction'].values[0].toString()).getArgument(0))).to.have.length(1);
        expect(Object.keys(container.getDefinition(controllers['c2:setSuite'].values[0].toString()).getArgument(0))).to.have.length(1);

        (new ResolveInvalidReferencesPass()).process(container);

        expect(Object.keys(container.getDefinition(controllers['c2:setSuite'].values[0].toString()).getArgument(0))).to.have.length(1);
        expect(container.getDefinition(controllers['c2:fooAction'].values[0].toString()).getArgument(0)).to.be.deep.equal({});

        (new RemoveEmptyControllerArgumentLocatorsPass()).process(container);

        controllers = container.getDefinition(resolver.getArgument(0).toString()).getArgument(0);

        expect(Object.keys(controllers)).to.be.deep.equal([ 'c1:fooAction' ]);
        expect(Object.keys(container.getDefinition(controllers['c1:fooAction'].values[0].toString()).getArgument(0))).to.be.deep.equal([ 'bar' ]);

        const expectedLog = [
            'Jymfony.Component.HttpServer.DependencyInjection.RemoveEmptyControllerArgumentLocatorsPass: Removing service-argument resolver for controller "c2:fooAction": no corresponding services exist for the referenced types.',
            'Jymfony.Component.HttpServer.DependencyInjection.RemoveEmptyControllerArgumentLocatorsPass: Removing method "setSuite" of service "c2" from controller candidates: the method is called by dependency injection, thus cannot be an action.',
        ];

        expect(container.getCompiler().getLogs()).to.be.deep.equal(expectedLog);
    });

    it ('process should work with invokable controller', () => {
        const container = new ContainerBuilder();
        const resolver = container.register('argument_resolver.service').addArgument([]);

        container.register('invokable', EmptyLocators.InvokableRegisterTestController)
            .addTag('controller.service_arguments')
        ;

        (new RegisterControllerArgumentLocatorsPass()).process(container);
        (new RemoveEmptyControllerArgumentLocatorsPass()).process(container);

        expect(Object.keys(container.getDefinition(resolver.getArgument(0).toString()).getArgument(0)))
            .to.be.deep.equal([ 'invokable:__invoke', 'invokable' ]);
    });
});
