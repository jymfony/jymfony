const TreeBuilder = Jymfony.Component.Config.Definition.Builder.TreeBuilder;
const expect = require('chai').expect;

describe('[Config] ExprBuilder', function () {
    const testBuilder = () => {
        const builder = new TreeBuilder();

        return builder.root('root')
            .children()
            .variableNode('key')
            .validate();
    };

    const finalizeTestBuilder = (testBuilder, config = undefined) => {
        return testBuilder
            .end()
            .end()
            .end()
            .buildTree()
            .finalize(config || { key: 'value' });
    };

    const expectFinalizedValueIs = (value, treeBuilder, config = undefined) => {
        expect(finalizeTestBuilder(treeBuilder, config))
            .to.be.deep.equal({ key: value });
    };

    it('always expression', () => {
        const builder = testBuilder()
            .always(() => 'test_value')
            .end();

        expectFinalizedValueIs('test_value', builder);
    });

    it('if true expression', () => {
        let builder = testBuilder()
            .ifTrue()
            .then(() => 'test_value')
            .end();
        expectFinalizedValueIs('test_value', builder, { key: true });

        builder = testBuilder()
            .ifTrue(() => true)
            .then(() => 'test_value')
            .end();
        expectFinalizedValueIs('test_value', builder);

        builder = testBuilder()
            .ifTrue(() => false)
            .then(() => 'test_value')
            .end();
        expectFinalizedValueIs('value', builder);
    });

    it('if string expression', () => {
        let builder = testBuilder()
            .ifString()
            .then(() => 'test_value')
            .end();
        expectFinalizedValueIs('test_value', builder);

        builder = testBuilder()
            .ifString()
            .then(() => 'test_value')
            .end();
        expectFinalizedValueIs(42, builder, { key: 42 });
    });

    it('if null expression', () => {
        let builder = testBuilder()
            .ifNull()
            .then(() => 'test_value')
            .end();
        expectFinalizedValueIs('value', builder);

        builder = testBuilder()
            .ifNull()
            .then(() => 'test_value')
            .end();
        expectFinalizedValueIs('test_value', builder, { key: null });

        builder = testBuilder()
            .ifNull()
            .then(() => 'test_value')
            .end();
        expectFinalizedValueIs('test_value', builder, { key: undefined });
    });

    it('if empty expression', () => {
        let builder = testBuilder()
            .ifEmpty()
            .then(() => 'test_value')
            .end();
        expectFinalizedValueIs('value', builder);

        builder = testBuilder()
            .ifEmpty()
            .then(() => 'test_value')
            .end();
        expectFinalizedValueIs('test_value', builder, { key: {} });

        builder = testBuilder()
            .ifEmpty()
            .then(() => 'test_value')
            .end();
        expectFinalizedValueIs('test_value', builder, { key: [] });
    });
});
