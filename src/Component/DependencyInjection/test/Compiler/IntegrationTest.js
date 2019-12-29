require('../../fixtures/namespace');

const FileLocator = Jymfony.Component.Config.FileLocator;
const Alias = Jymfony.Component.DependencyInjection.Alias;
const ServiceLocatorArgument = Jymfony.Component.DependencyInjection.Argument.ServiceLocatorArgument;
const TaggedIteratorArgument = Jymfony.Component.DependencyInjection.Argument.TaggedIteratorArgument;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const YamlFileLoader = Jymfony.Component.DependencyInjection.Loader.YamlFileLoader;
const Fixtures = Jymfony.Component.DependencyInjection.Fixtures;
const Reference = Jymfony.Component.DependencyInjection.Reference;
const ServiceLocator = Jymfony.Component.DependencyInjection.ServiceLocator;
const { expect } = require('chai');

describe('[DependencyInjection] Compiler', function () {
    /**
     * This tests that dependencies are correctly processed.
     *
     * We're checking that:
     *
     *   * A is public, B/C are private
     *   * A -> C
     *   * B -> C
     */
    it ('should remove and inline services recursively', () => {
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

        expect(container.hasDefinition('a')).to.be.equal(true);
        const args = a.getArguments();
        expect(args[0]).to.be.equal(c);
        expect(container.hasDefinition('b')).to.be.equal(false);
        expect(container.hasDefinition('c')).to.be.equal(false);
    });

    it ('should inline references to aliases', () => {
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

        expect(container.hasDefinition('a')).to.be.equal(true);
        const args = a.getArguments();
        expect(args[0]).to.be.equal(c);
        expect(container.hasAlias('b')).to.be.equal(false);
        expect(container.hasDefinition('c')).to.be.equal(false);
    });

    it ('should inline when there are multiple references but for the same definition', () => {
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

        expect(container.hasDefinition('a')).to.be.equal(true);
        expect(container.hasDefinition('b')).to.be.equal(false);
        expect(container.hasDefinition('c')).to.be.equal(false, 'Service C was not inlined');
    });

    it ('service subscriber could be decorated', () => {
        const container = new ContainerBuilder();
        container.register(Fixtures.Integration.ServiceSubscriberStub)
            .addTag('container.service_subscriber')
            .setPublic(true);

        container.register(Fixtures.Integration.DecoratedServiceSubscriber)
            .setDecoratedService(Fixtures.Integration.ServiceSubscriberStub);

        container.compile();

        expect(container.get(Fixtures.Integration.ServiceSubscriberStub))
            .to.be.instanceOf(Fixtures.Integration.DecoratedServiceSubscriber);
    });

    it ('service locators could be decorated', () => {
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

        expect(container.get(ServiceLocator)).to.be.instanceOf(Fixtures.Integration.DecoratedServiceLocator);
        expect(container.get(ServiceLocator).get('foo')).to.be.equal(container.get('foo'));
    });

    const getYamlCompileTests = function * () {
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

    for (const [ directory, actualServiceId, expectedServiceId, mainContainer = null ] of getYamlCompileTests()) {
        it('yaml container should compile: ' + directory, () => {
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

            expect(actualService).to.dump.as(expectedService);
        });
    }

    it ('should register service locator with fallback', () => {
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

        /** @var ServiceLocator $serviceLocator */
        const serviceLocator = s.getParam();
        expect(serviceLocator).to.be.instanceOf(
            ServiceLocator,
            __jymfony.sprintf('Wrong instance, should be an instance of ServiceLocator, %s given', typeof serviceLocator)
        );

        expect(serviceLocator.get('bar_tag')).to.be.equal(container.get('bar_tag'));
    });
});
