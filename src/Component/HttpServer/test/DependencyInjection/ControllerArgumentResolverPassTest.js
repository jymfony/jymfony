const ArgumentResolver = Jymfony.Component.HttpServer.Controller.ArgumentResolver;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const ControllerArgumentValueResolverPass = Jymfony.Component.HttpServer.DependencyInjection.ControllerArgumentValueResolverPass;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const Reference = Jymfony.Component.DependencyInjection.Reference;
const Stopwatch = Jymfony.Component.Stopwatch.Stopwatch;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const VarDumperTestTrait = Jymfony.Component.VarDumper.Test.VarDumperTestTrait;

export default class ControllerArgumentResolverPassTest extends mix(TestCase, VarDumperTestTrait) {
    get testCaseName() {
        return '[HttpServer] ' + super.testCaseName;
    }

    testServicesShouldBeOrderedAccordingToPriority() {
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
        this.assertDumpEquals(expected, definition.getArgument(1).values);

        __self.assertEquals(false, container.hasDefinition('debug.n1'));
        __self.assertEquals(false, container.hasDefinition('debug.n2'));
        __self.assertEquals(false, container.hasDefinition('debug.n3'));
    }

    testStopwatchShouldBeInjectedInDebug() {
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
        this.assertDumpEquals(expected, definition.getArgument(1).values);

        __self.assertEquals(true, container.hasDefinition('debug.n1'));
        __self.assertEquals(true, container.hasDefinition('debug.n2'));
        __self.assertEquals(true, container.hasDefinition('debug.n3'));

        __self.assertEquals(true, container.hasDefinition('n1'));
        __self.assertEquals(true, container.hasDefinition('n2'));
        __self.assertEquals(true, container.hasDefinition('n3'));
    }

    testShouldNotInjectStopwatchIfNotRegistered() {
        const expected = [ new Reference('n1') ];

        const definition = new Definition(ArgumentResolver, [ null, [] ]);
        const container = new ContainerBuilder();
        container.register('n1').addTag('controller.argument_value_resolver');
        container.setDefinition('argument_resolver', definition);

        container.setParameter('kernel.debug', true);

        (new ControllerArgumentValueResolverPass()).process(container);
        this.assertDumpEquals(expected, definition.getArgument(1).values);

        __self.assertEquals(false, container.hasDefinition('debug.n1'));
        __self.assertEquals(true, container.hasDefinition('n1'));
    }

    testShouldReturnEmptyArrayWhenNoServiceIsPresent() {
        const definition = new Definition(ArgumentResolver, [ null, [] ]);
        const container = new ContainerBuilder();
        container.setDefinition('argument_resolver', definition);

        container.setParameter('kernel.debug', false);

        (new ControllerArgumentValueResolverPass()).process(container);
        __self.assertEquals([], definition.getArgument(1).values);
    }

    testShouldNotBreakIfResolverIsAbsent() {
        const container = new ContainerBuilder();
        (new ControllerArgumentValueResolverPass()).process(container);

        __self.assertEquals(false, container.hasDefinition('argument_resolver'));
    }
}
