const Builder = Jymfony.Component.Config.Definition.Builder;
const Processor = Jymfony.Component.Config.Definition.Processor;
const PrototypedArrayNode = Jymfony.Component.Config.Definition.PrototypedArrayNode;
const Exception = Jymfony.Component.Config.Definition.Exception;
const { expect } = require('chai');

describe('[Config] ArrayNodeDefinition', function () {
    it('should append nodes', () => {
        const parent = new Builder.ArrayNodeDefinition('root');
        const child = new Builder.ScalarNodeDefinition('child');

        /* eslint-disable indent */
        parent
            .children()
                .scalarNode('foo').end()
                .scalarNode('bar').end()
            .end()
            .append(child)
        ;
        /* eslint-enabled indent */

        expect(Object.keys(parent._children)).to.have.lengthOf(3);
        expect(Object.values(parent._children)).to.include(child);
    });

    const providePrototypeNodeSpecificCalls = function * providePrototypeNodeSpecificCalls() {
        yield [ 'defaultValue', [ [] ] ];
        yield [ 'addDefaultChildrenIfNoneSet', [] ];
        yield [ 'requiresAtLeastOneElement', [] ];
        yield [ 'cannotBeEmpty', [] ];
        yield [ 'useAttributeAsKey', [ 'foo' ] ];
    };

    let key = 0;
    for (const test of providePrototypeNodeSpecificCalls()) {
        it('prototype node specific call with dataset #'+(key++), () => {
            const [ method, args ] = test;
            const node = new Builder.ArrayNodeDefinition('root');
            node[method](...args);

            expect(node.getNode.bind(node))
                .to.throw(Exception.InvalidDefinitionException);
        });
    }

    it('concrete node specific option should throw', () => {
        const node = new Builder.ArrayNodeDefinition('root');

        node.addDefaultsIfNotSet()
            .prototype('array');

        expect(node.getNode.bind(node))
            .to.throw(Exception.InvalidDefinitionException);
    });

    it('trying to set default value when using a default children should throw', () => {
        const node = new Builder.ArrayNodeDefinition('root');

        node
            .defaultValue([])
            .addDefaultChildrenIfNoneSet('foo')
            .prototype('array');

        expect(node.getNode.bind(node))
            .to.throw(Exception.InvalidDefinitionException);
    });

    it('should build node with default empty object when using default children', () => {
        const node = new Builder.ArrayNodeDefinition('root');

        node
            .addDefaultChildrenIfNoneSet()
            .prototype('array');

        const tree = node.getNode();
        expect(tree.getDefaultValue()).to.be.deep.equal([ {} ]);
    });

    const providePrototypedArrayNodeDefaults = function * providePrototypedArrayNodeDefaults() {
        yield [ null, true, false, [ {} ] ];
        yield [ 2, true, false, [ {}, {} ] ];
        yield [ '2', false, true, { '2': {} } ];
        yield [ 'foo', false, true, { 'foo': {} } ];
        yield [ [ 'foo' ], false, true, { 'foo': {} } ];
        yield [ [ 'foo', 'bar' ], false, true, { 'foo': {}, 'bar': {} } ];
    };

    key = 0;
    for (const test of providePrototypedArrayNodeDefaults()) {
        it('prototype array node deafults with dataset #'+(key++), () => {
            const [ args, shouldThrowWhenUsingAttrAsKey, shouldThrowWhenNotUsingAttrAsKey, defaults ] = test;
            let node = new Builder.ArrayNodeDefinition('root');
            node
                .addDefaultChildrenIfNoneSet(args)
                .prototype('array')
            ;

            let tree;
            try {
                tree = node.getNode();
                expect(shouldThrowWhenNotUsingAttrAsKey).to.be.false;
                expect(tree.getDefaultValue()).to.be.deep.equal(defaults);
            } catch {
                expect(shouldThrowWhenNotUsingAttrAsKey).to.be.true;
            }

            node = new Builder.ArrayNodeDefinition('root');
            node
                .useAttributeAsKey('attr')
                .addDefaultChildrenIfNoneSet(args)
                .prototype('array')
            ;

            try {
                tree = node.getNode();
                expect(shouldThrowWhenUsingAttrAsKey).to.be.false;
                expect(tree.getDefaultValue()).to.be.deep.equal(defaults);
            } catch {
                expect(shouldThrowWhenUsingAttrAsKey).to.be.true;
            }
        });
    }

    it('nested prototyped array nodes should work', () => {
        const node = new Builder.ArrayNodeDefinition('root');

        node
            .addDefaultChildrenIfNoneSet()
            .prototype('array')
                .prototype('array');

        const tree = node.getNode();
        expect(tree).to.be.instanceOf(PrototypedArrayNode);
        expect(tree.getPrototype()).to.be.instanceOf(PrototypedArrayNode);
    });

    it('canBeEnabled should not enable node by default', () => {
        const node = new Builder.ArrayNodeDefinition('root');

        node
            .canBeEnabled()
            .children()
                .scalarNode('foo').defaultValue('bar').end()
        ;

        expect(node.getNode().getDefaultValue())
            .to.be.deep.equal({ enabled: false, foo: 'bar' });
    });

    const getEnableableNodeFixtures = function * getEnableableNodeFixtures() {
        yield [ {enabled: true, foo: 'bar'}, [ true ] ];
        yield [ {enabled: true, foo: 'bar'}, [ null ] ];
        yield [ {enabled: true, foo: 'bar'}, [ {enabled: true} ] ];
        yield [ {enabled: true, foo: 'baz'}, [ {foo: 'baz'} ] ];
        yield [ {enabled: false, foo: 'baz'}, [ {foo: 'baz', enabled: false} ] ];
        yield [ {enabled: false, foo: 'bar'}, [ false ] ];
    };

    key = 0;
    for (const test of getEnableableNodeFixtures()) {
        it('enable node with dataset #'+(key++), () => {
            const [ expected, config ] = test;
            const processor = new Processor();
            const node = new Builder.ArrayNodeDefinition('root');
            node
                .canBeEnabled()
                .children()
                    .scalarNode('foo').defaultValue('bar').end()
            ;

            expect(processor.process(node.getNode(), config)).to.be.deep.equal(expected);
        });
    }

    it('requiresAtLeastOneElement should not throw', () => {
        const node = new Builder.ArrayNodeDefinition('root');
        node
            .requiresAtLeastOneElement()
            .integerPrototype();

        const tree = node.getNode();
        expect(tree.finalize.bind(tree, [ 1 ])).not.throw(Error);
    });

    it('cannotBeEmpty should throw', () => {
        const node = new Builder.ArrayNodeDefinition('root');
        node
            .cannotBeEmpty()
            .integerPrototype();

        const tree = node.getNode();
        expect(tree.finalize.bind(tree, [ ]))
            .to.throw(Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException);
    });

    it('set deprecated should work', () => {
        const node = new Builder.ArrayNodeDefinition('root');
        node
            .children()
                .arrayNode('foo').setDeprecated('The "%path%" node is deprecated.').end()
            .end()
        ;

        const deprecatedNode = node.getNode().getChildren().foo;

        expect(deprecatedNode.isDeprecated()).to.be.true;
        expect(deprecatedNode.getDeprecationMessage(deprecatedNode.getName(), deprecatedNode.getPath()))
            .to.be.equal('The "root.foo" node is deprecated.');
    });

    it('cannot be empty on concrete node', () => {
        const node = new Builder.ArrayNodeDefinition('root');
        node.cannotBeEmpty();

        expect(node.getNode.bind(node))
            .to.throw(Jymfony.Component.Config.Definition.Exception.InvalidDefinitionException);
    });
});
