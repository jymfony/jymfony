const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const Reference = Jymfony.Component.DependencyInjection.Reference;
const ArgumentResolver = Jymfony.Component.HttpServer.Controller.ArgumentResolver;
const ControllerArgumentValueResolverPass = Jymfony.Component.HttpServer.DependencyInjection.ControllerArgumentValueResolverPass;
const Stopwatch = Jymfony.Component.Stopwatch.Stopwatch;
const { expect } = require('chai');

describe('[HttpServer] ControllerArgumentResolverPass', function () {
    it ('services should be ordered according to priority', () => {
        const services = {
            n3: [ {} ],
            n1: [ {priority: 200} ],
            n2: [ {priority: 100} ],
        };

        const expected = [
            new Reference('n1'),
            new Reference('n2'),
            new Reference('n3'),
        ];

        const definition = new Definition(ArgumentResolver, [ null, [] ]);
        const container = new ContainerBuilder();
        container.setDefinition('argument_resolver', definition);

        for (const [ id, [ tag ] ] of __jymfony.getEntries(services)) {
            container.register(id).addTag('controller.argument_value_resolver', tag);
        }

        container.setParameter('kernel.debug', false);

        (new ControllerArgumentValueResolverPass()).process(container);
        expect(definition.getArgument(1).values).to.dumpsAs(expected);

        expect(container.hasDefinition('debug.n1')).to.be.equal(false);
        expect(container.hasDefinition('debug.n2')).to.be.equal(false);
        expect(container.hasDefinition('debug.n3')).to.be.equal(false);
    });

    it ('stopwatch should be injected in debug', () => {
        const services = {
            n3: [ {} ],
            n1: [ {priority: 200} ],
            n2: [ {priority: 100} ],
        };

        const expected = [
            new Reference('n1'),
            new Reference('n2'),
            new Reference('n3'),
        ];

        const definition = new Definition(ArgumentResolver, [ null, [] ]);
        const container = new ContainerBuilder();
        container.setDefinition('argument_resolver', definition);
        container.register('debug.stopwatch', Stopwatch);
        container.setDefinition('argument_resolver', definition);

        for (const [ id, [ tag ] ] of __jymfony.getEntries(services)) {
            container.register(id).addTag('controller.argument_value_resolver', tag);
        }

        container.setParameter('kernel.debug', true);

        (new ControllerArgumentValueResolverPass()).process(container);
        expect(definition.getArgument(1).values).to.dumpsAs(expected);

        expect(container.hasDefinition('debug.n1')).to.be.equal(true);
        expect(container.hasDefinition('debug.n2')).to.be.equal(true);
        expect(container.hasDefinition('debug.n3')).to.be.equal(true);

        expect(container.hasDefinition('n1')).to.be.equal(true);
        expect(container.hasDefinition('n2')).to.be.equal(true);
        expect(container.hasDefinition('n3')).to.be.equal(true);
    });

    it ('should not inject stopwatch if not registered', () => {
        const expected = [ new Reference('n1') ];

        const definition = new Definition(ArgumentResolver, [ null, [] ]);
        const container = new ContainerBuilder();
        container.register('n1').addTag('controller.argument_value_resolver');
        container.setDefinition('argument_resolver', definition);

        container.setParameter('kernel.debug', true);

        (new ControllerArgumentValueResolverPass()).process(container);
        expect(definition.getArgument(1).values).to.dumpsAs(expected);

        expect(container.hasDefinition('debug.n1')).to.be.equal(false);
        expect(container.hasDefinition('n1')).to.be.equal(true);
    });

    it ('should return empty array when no service is present', () => {
        const definition = new Definition(ArgumentResolver, [ null, [] ]);
        const container = new ContainerBuilder();
        container.setDefinition('argument_resolver', definition);

        container.setParameter('kernel.debug', false);

        (new ControllerArgumentValueResolverPass()).process(container);
        expect(definition.getArgument(1).values).to.be.deep.equal([]);
    });

    it ('should not break if resolver is absent', () => {
        const container = new ContainerBuilder();
        (new ControllerArgumentValueResolverPass()).process(container);

        expect(container.hasDefinition('argument_resolver')).to.be.equal(false);
    });
});
