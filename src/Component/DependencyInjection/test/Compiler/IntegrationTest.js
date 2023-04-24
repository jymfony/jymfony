const Alias = Jymfony.Component.DependencyInjection.Alias;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const FileLocator = Jymfony.Component.Config.FileLocator;
const Fixtures = Jymfony.Component.DependencyInjection.Fixtures;
const Reference = Jymfony.Component.DependencyInjection.Reference;
const ServiceLocator = Jymfony.Component.DependencyInjection.ServiceLocator;
const ServiceLocatorArgument = Jymfony.Component.DependencyInjection.Argument.ServiceLocatorArgument;
const TaggedIteratorArgument = Jymfony.Component.DependencyInjection.Argument.TaggedIteratorArgument;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const VarDumperTestTrait = Jymfony.Component.VarDumper.Test.VarDumperTestTrait;
const YamlFileLoader = Jymfony.Component.DependencyInjection.Loader.YamlFileLoader;

export default class IntegrationTest extends mix(TestCase, VarDumperTestTrait) {
    get testCaseName() {
        return '[DependencyInjection] ' + super.testCaseName;
    }

    /**
     * This tests that dependencies are correctly processed.
     *
     * We're checking that:
     *
     *   * A is public, B/C are private
     *   * A -> C
     *   * B -> C
     */
    testShouldRemoveAndInlineServicesRecursively() {
        const container = new ContainerBuilder();
        container.setResourceTracking(false);

        const a = container
            .register('a', 'Object')
            .addArgument(new Reference('c'))
            .setPublic(true)
        ;

        container
            .register('b', 'Object')
            .addArgument(new Reference('c'))
            .setPublic(false)
        ;

        const c = container
            .register('c', 'Object')
            .setPublic(false)
        ;

        container.compile();

        __self.assertEquals(true, container.hasDefinition('a'));
        const args = a.getArguments();
        __self.assertEquals(c, args[0]);
        __self.assertEquals(false, container.hasDefinition('b'));
        __self.assertEquals(false, container.hasDefinition('c'));
    }

    testShouldInlineReferencesToAliases() {
        const container = new ContainerBuilder();
        container.setResourceTracking(false);

        const a = container
            .register('a', 'Object')
            .addArgument(new Reference('b'))
            .setPublic(true)
        ;

        container.setAlias('b', new Alias('c', false));

        const c = container
            .register('c', 'Object')
            .setPublic(false)
        ;

        container.compile();

        __self.assertEquals(true, container.hasDefinition('a'));
        const args = a.getArguments();
        __self.assertEquals(c, args[0]);
        __self.assertEquals(false, container.hasAlias('b'));
        __self.assertEquals(false, container.hasDefinition('c'));
    }

    testShouldInlineWhenThereAreMultipleReferencesButForTheSameDefinition() {
        const container = new ContainerBuilder();
        container.setResourceTracking(false);

        container
            .register('a', 'Object')
            .addArgument(new Reference('b'))
            .addMethodCall('setC', [ new Reference('c') ])
            .setPublic(true)
        ;

        container
            .register('b', 'Object')
            .addArgument(new Reference('c'))
            .setPublic(false)
        ;

        container
            .register('c', 'Object')
            .setPublic(false)
        ;

        container.compile();

        __self.assertTrue(container.hasDefinition('a'));
        __self.assertFalse(container.hasDefinition('b'));
        __self.assertFalse(container.hasDefinition('c'), 'Service C was not inlined');
    }

    testServiceSubscriberCouldBeDecorated() {
        const container = new ContainerBuilder();
        container.register(Fixtures.Integration.ServiceSubscriberStub)
            .addTag('container.service_subscriber')
            .setPublic(true);

        container.register(Fixtures.Integration.DecoratedServiceSubscriber)
            .setDecoratedService(Fixtures.Integration.ServiceSubscriberStub);

        container.compile();

        __self.assertInstanceOf(Fixtures.Integration.DecoratedServiceSubscriber, container.get(Fixtures.Integration.ServiceSubscriberStub));
    }

    testServiceLocatorsCouldBeDecorated() {
        const container = new ContainerBuilder();
        container.register('foo', 'Object').setPublic(true);

        container.register(ServiceLocator)
            .addTag('container.service_locator')
            .addArgument([ new Reference('foo') ])
            .setPublic(true)
        ;

        container.register(Fixtures.Integration.DecoratedServiceLocator)
            .setDecoratedService(ServiceLocator)
            .setArguments([ new Reference(ReflectionClass.getClassName(Fixtures.Integration.DecoratedServiceLocator) + '.inner') ])
        ;

        container.compile();

        __self.assertInstanceOf(Fixtures.Integration.DecoratedServiceLocator, container.get(ServiceLocator));
        __self.assertEquals(container.get('foo'), container.get(ServiceLocator).get('foo'));
    }

    * getYamlCompileTests() {
        let container = new ContainerBuilder();
        container.registerForAutoconfiguration(Fixtures.Integration.IntegrationTestStub);
        yield [ 'autoconfigure_child_not_applied', 'child_service', 'child_service_expected', container ];

        container = new ContainerBuilder();
        container.registerForAutoconfiguration(Fixtures.Integration.IntegrationTestStub);
        yield [ 'autoconfigure_parent_child', 'child_service', 'child_service_expected', container ];

        container = new ContainerBuilder();
        container.registerForAutoconfiguration(Fixtures.Integration.IntegrationTestStub).addTag('from_autoconfigure');
        yield [ 'autoconfigure_parent_child_tags', 'child_service', 'child_service_expected', container ];

        yield [ 'child_parent', 'child_service', 'child_service_expected' ];

        yield [ 'defaults_child_tags', 'child_service', 'child_service_expected' ];

        yield [ 'defaults_instanceof_importance', 'main_service', 'main_service_expected' ];

        yield [ 'defaults_parent_child', 'child_service', 'child_service_expected' ];

        yield [ 'instanceof_parent_child', 'child_service', 'child_service_expected' ];

        container = new ContainerBuilder();
        container.registerForAutoconfiguration(Fixtures.Integration.IntegrationTestStub)
            .addMethodCall('setSunshine', [ 'supernova' ]);
        yield [ 'instanceof_and_calls', 'main_service', 'main_service_expected', container ];
    };

    @dataProvider('getYamlCompileTests')
    testYamlContainerShouldCompile(directory, actualServiceId, expectedServiceId, mainContainer = null) {
        // Allow a container to be passed in, which might have autoconfigure settings
        let container = mainContainer || new ContainerBuilder();
        container.setResourceTracking(false);
        let loader = new YamlFileLoader(container,
            new FileLocator(__dirname + '/../../fixtures/yaml/integration/' + directory)
        );

        loader.load('main.yml');
        container.compile();
        const actualService = container.getDefinition(actualServiceId);

        // Create a fresh ContainerBuilder, to avoid autoconfigure stuff
        container = new ContainerBuilder();
        container.setResourceTracking(false);
        loader = new YamlFileLoader(container,
            new FileLocator(__dirname + '/../../fixtures/yaml/integration/' + directory)
        );

        loader.load('expected.yml');
        container.compile();
        const expectedService = container.getDefinition(expectedServiceId);

        // Reset changes, we don't care if these differ
        actualService.setChanges({});
        expectedService.setChanges({});

        this.assertDumpEquals(expectedService, actualService);
    }

    testShouldRegisterServiceLocatorWithFallback() {
        const container = new ContainerBuilder();
        container.register('bar_tag', 'Object')
            .setPublic(true)
            .addTag('foo_bar')
        ;

        container.register('foo_bar_tagged', Fixtures.Integration.FooBarTaggedClass)
            .addArgument(new ServiceLocatorArgument(new TaggedIteratorArgument('foo_bar')))
            .setPublic(true)
        ;

        container.compile();

        const s = container.get('foo_bar_tagged');

        /** @var {ServiceLocator} serviceLocator */
        const serviceLocator = s.getParam();
        __self.assertInstanceOf(ServiceLocator, serviceLocator, __jymfony.sprintf('Wrong instance, should be an instance of ServiceLocator, %s given', typeof serviceLocator));
        __self.assertEquals(container.get('bar_tag'), serviceLocator.get('bar_tag'));
    }
}
