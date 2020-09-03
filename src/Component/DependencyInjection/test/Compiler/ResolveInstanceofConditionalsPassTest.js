const ChildDefinition = Jymfony.Component.DependencyInjection.ChildDefinition;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const Fixtures = Jymfony.Component.DependencyInjection.Fixtures;
const InvalidArgumentException = Jymfony.Component.DependencyInjection.Exception.InvalidArgumentException;
const ResolveChildDefinitionsPass = Jymfony.Component.DependencyInjection.Compiler.ResolveChildDefinitionsPass;
const ResolveInstanceofConditionalsPass = Jymfony.Component.DependencyInjection.Compiler.ResolveInstanceofConditionalsPass;
const RuntimeException = Jymfony.Component.DependencyInjection.Exception.RuntimeException;
const { expect } = require('chai');

describe('[DependencyInjection] Compiler.ResolveInstanceofConditionalsPass', function () {
    it ('process should work', () => {
        const container = new ContainerBuilder();
        let def = container.register('foo', Fixtures.Bar).addTag('tag').setChanges({});
        def.setInstanceofConditionals({
            'Jymfony.Component.DependencyInjection.Fixtures.BarInterface': (new ChildDefinition('')).addProperty('foo', 'bar').addTag('baz', { 'attr': 123 }),
        });

        (new ResolveInstanceofConditionalsPass()).process(container);

        let parent = '.instanceof.Jymfony.Component.DependencyInjection.Fixtures.BarInterface.0.foo';
        def = container.getDefinition('foo');

        expect(def.getInstanceofConditionals()).to.be.deep.eq({});
        expect(def).to.be.instanceOf(ChildDefinition);
        expect(def.getParent()).to.be.eq(parent);
        expect(def.getTags()).to.be.deep.eq({ tag: [ {} ], baz: [ {attr: 123} ] });

        parent = container.getDefinition(parent);
        expect(parent.getProperties()).to.be.deep.eq({ foo: 'bar' });
        expect(parent.getTags()).to.be.deep.eq({});
    });

    it ('process should process child definitions', () => {
        const container = new ContainerBuilder();

        let def = container
            .register('parent', Fixtures.Bar)
            .addMethodCall('foo', [ 'foo' ]);
        def.setInstanceofConditionals({
            'Jymfony.Component.DependencyInjection.Fixtures.BarInterface': (new ChildDefinition('')).addMethodCall('foo', [ 'bar' ]),
        });

        def = (new ChildDefinition('parent')).setClass(Fixtures.ChildBar);
        container.setDefinition('child', def);

        (new ResolveInstanceofConditionalsPass()).process(container);
        (new ResolveChildDefinitionsPass()).process(container);

        const expected = [
            [ 'foo', [ 'bar' ] ],
            [ 'foo', [ 'foo' ] ],
        ];

        expect(container.getDefinition('parent').getMethodCalls()).to.be.deep.eq(expected);
        expect(container.getDefinition('child').getMethodCalls()).to.be.deep.eq(expected);
    });

    it ('process should replace shared flag', () => {
        const container = new ContainerBuilder();

        let def = container.register('foo', 'Object');
        def.setInstanceofConditionals({
            'Object': (new ChildDefinition('')).setShared(false),
        });

        (new ResolveInstanceofConditionalsPass()).process(container);

        def = container.getDefinition('foo');
        expect(def.isShared()).to.be.false;
    });

    it ('process should process handles multiple inheritance', () => {
        const container = new ContainerBuilder();
        let def = container.register('foo', Fixtures.ChildBar).setShared(true);

        def.setInstanceofConditionals({
            'Jymfony.Component.DependencyInjection.Fixtures.Bar': (new ChildDefinition('')).setLazy(true).setShared(false),
            'Jymfony.Component.DependencyInjection.Fixtures.ChildBar': (new ChildDefinition('')).addTag('foo_tag'),
        });

        (new ResolveInstanceofConditionalsPass()).process(container);
        (new ResolveChildDefinitionsPass()).process(container);

        def = container.getDefinition('foo');

        expect(def.getTags()).to.be.deep.eq({ foo_tag: [ {} ] });
        expect(def.isLazy()).to.be.true;
        expect(def.isShared()).to.be.true;
    });

    it ('process should use autoconfigure services', () => {
        const container = new ContainerBuilder();

        let def = container.register('normal_service', Fixtures.ChildBar);
        def.setInstanceofConditionals({
            'Jymfony.Component.DependencyInjection.Fixtures.Bar': (new ChildDefinition(''))
                .addTag('local_instanceof_tag')
                .setFactory('locally_set_factory'),
        });

        def.setAutoconfigured(true);
        container.registerForAutoconfiguration(Fixtures.Bar)
            .addTag('autoconfigured_tag')
            .setFactory('autoconfigured_factory');

        (new ResolveInstanceofConditionalsPass()).process(container);
        (new ResolveChildDefinitionsPass()).process(container);

        def = container.getDefinition('normal_service');
        // Factory from the specific instanceof overrides global one
        expect(def.getFactory()).to.be.eq('locally_set_factory');
        // Tags are merged, the locally set one is first
        expect(def.getTags()).to.be.deep.eq({ local_instanceof_tag: [ {} ], autoconfigured_tag: [ {} ] });
    });

    it ('autoconfiguration should not duplicate tags', () => {
        const container = new ContainerBuilder();
        let def = container.register('normal_service', Fixtures.ChildBar);
        def.addTag('duplicated_tag')
            .addTag('duplicated_tag', {and_attributes: 1})
            .setAutoconfigured(true)
        ;

        def.setInstanceofConditionals({
            'Jymfony.Component.DependencyInjection.Fixtures.Bar': (new ChildDefinition('')).addTag('duplicated_tag'),
        });

        container.registerForAutoconfiguration(Fixtures.Bar)
            .addTag('duplicated_tag', {and_attributes: 1})
        ;

        (new ResolveInstanceofConditionalsPass()).process(container);
        (new ResolveChildDefinitionsPass()).process(container);

        def = container.getDefinition('normal_service');
        expect(def.getTags()).to.be.deep.eq({ duplicated_tag: [ {}, { and_attributes: 1 } ] });
    });

    it ('process should not use autoconfiguration if not enabled', () => {
        const container = new ContainerBuilder();
        let def = container.register('normal_service', Fixtures.ChildBar);
        def.setInstanceofConditionals({
            'Jymfony.Component.DependencyInjection.Fixtures.Bar': (new ChildDefinition('')).addTag('foo_tag'),
        });

        container.registerForAutoconfiguration(Fixtures.Bar).setConfigurator('configurator');

        (new ResolveInstanceofConditionalsPass()).process(container);
        (new ResolveChildDefinitionsPass()).process(container);

        def = container.getDefinition('normal_service');
        expect(def.getConfigurator()).to.be.undefined;
    });

    it ('passing a bad interface should throw an exception', () => {
        const container = new ContainerBuilder();
        const def = container.register('normal_service', Fixtures.ChildBar);
        def.setInstanceofConditionals({
            'App.FakeInterface': (new ChildDefinition('')).addTag('foo_tag'),
        });

        expect(() => (new ResolveInstanceofConditionalsPass()).process(container)).to.throw(
            RuntimeException,
            /"App.FakeInterface" is set as an "instanceof" conditional, but it does not exist\./
        );
    });

    it ('passing a bad interface should not throw in register for autoconfiguration', () => {
        const container = new ContainerBuilder();
        container.register('normal_service', Fixtures.ChildBar).setAutoconfigured(true);
        container.registerForAutoconfiguration('App.FakeInterface').addTag('auto_tag');

        (new ResolveInstanceofConditionalsPass()).process(container);
        expect(container.hasDefinition('normal_service')).to.be.true;
    });

    /**
     * Test that autoconfigured calls are handled gracefully.
     */
    it ('should process autoconfigured method calls', () => {
        const container = new ContainerBuilder();

        const expected = [
            [ 'setFoo', [
                'plain_value',
                '%some_parameter%',
            ] ],
            [ 'callBar', [] ],
            [ 'isBaz', [] ],
        ];

        container.registerForAutoconfiguration(Fixtures.Bar).addMethodCall('setFoo', expected[0][1]);
        container.registerForAutoconfiguration(Fixtures.ChildBar).addMethodCall('callBar');

        const def = container.register('foo', Fixtures.ChildBar).setAutoconfigured(true).addMethodCall('isBaz');
        expect(def.getMethodCalls()).to.be.deep.eq([ [ 'isBaz', [] ] ]);

        (new ResolveInstanceofConditionalsPass()).process(container);

        expect(container.findDefinition('foo').getMethodCalls()).to.be.deep.eq(expected);
    });

    it ('should throw exception for argument', () => {
        const container = new ContainerBuilder();
        container.registerForAutoconfiguration(Fixtures.Bar).addArgument('bar');

        expect(() => (new ResolveInstanceofConditionalsPass()).process(container)).to.throw(
            InvalidArgumentException,
            /Autoconfigured instanceof for type "Jymfony.Component.DependencyInjection.Fixtures.Bar" defines arguments but these are not supported and should be removed./
        );
    });

    it ('should reset instanceof definitions', () => {
        const container = new ContainerBuilder();

        container
            .register('bar', Fixtures.ChildBar)
            .addArgument('a')
            .addMethodCall('setB')
            .addShutdownCall('setC')
            .setDecoratedService('foo')
            .addTag('t')
            .setInstanceofConditionals({
                'Jymfony.Component.DependencyInjection.Fixtures.Bar': (new ChildDefinition('')).addTag('bar'),
            })
        ;

        (new ResolveInstanceofConditionalsPass()).process(container);

        const abstract = container.getDefinition('.abstract.instanceof.bar');

        expect(abstract.getArguments()).to.be.empty;
        expect(abstract.getMethodCalls()).to.be.empty;
        expect(abstract.getShutdownCalls()).to.be.empty;
        expect(abstract.getDecoratedService()).to.be.undefined;
        expect(abstract.getTags()).to.be.empty;
        expect(abstract.isAbstract()).to.be.true;
    });

    it ('decorators should be not automatically tagged', () => {
        const container = new ContainerBuilder();

        const decorator = container.register('decorator', Fixtures.ChildBar);
        decorator.setDecoratedService('decorated');
        decorator.setInstanceofConditionals({
            'Jymfony.Component.DependencyInjection.Fixtures.Bar': (new ChildDefinition('')).addTag('tag'),
        });
        decorator.setAutoconfigured(true);
        decorator.addTag('manual');

        container.registerForAutoconfiguration(Fixtures.Bar).addTag('tag');

        (new ResolveInstanceofConditionalsPass()).process(container);
        (new ResolveChildDefinitionsPass()).process(container);

        expect(container.getDefinition('decorator').getTags()).to.be.deep.eq({ manual: [ {} ] });
    });
});
