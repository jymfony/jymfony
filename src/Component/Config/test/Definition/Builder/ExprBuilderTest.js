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

    it('if array expression', () => {
        let builder = testBuilder()
            .ifArray()
            .then(() => 'test_value')
            .end();
        expectFinalizedValueIs('value', builder);

        builder = testBuilder()
            .ifArray()
            .then(() => 'test_value')
            .end();
        expectFinalizedValueIs('test_value', builder, { key: { foo: 'bar' } });

        builder = testBuilder()
            .ifArray()
            .then(() => 'test_value')
            .end();
        expectFinalizedValueIs('test_value', builder, { key: [ 'bar', 'baz' ] });
    });

    it('if inArray expression', () => {
        let builder = testBuilder()
            .ifInArray([ 'foo', 'bar' ])
            .then(() => 'test_value')
            .end();
        expectFinalizedValueIs('value', builder);

        builder = testBuilder()
            .ifInArray([ 'foo', 'bar', 'value' ])
            .then(() => 'test_value')
            .end();
        expectFinalizedValueIs('test_value', builder);
    });

    it('if notInArray expression', () => {
        let builder = testBuilder()
            .ifNotInArray([ 'foo', 'bar' ])
            .then(() => 'test_value')
            .end();
        expectFinalizedValueIs('test_value', builder);

        builder = testBuilder()
            .ifNotInArray([ 'foo', 'bar', 'value' ])
            .then(() => 'test_value')
            .end();
        expectFinalizedValueIs('value', builder);
    });

    it('then empty array expression', () => {
        const builder = testBuilder()
            .ifString()
            .thenEmptyArray()
            .end();
        expectFinalizedValueIs([], builder);
    });

    it('then empty object expression', () => {
        const builder = testBuilder()
            .ifString()
            .thenEmptyObject()
            .end();
        expectFinalizedValueIs({}, builder);
    });

    it('then invalid expression', () => {
        const builder = testBuilder()
            .ifString()
            .thenInvalid('Invalid value')
            .end();

        expect(() => finalizeTestBuilder(builder))
            .to.throw(Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException);
    });

    it('then unset expression', () => {
        const builder = testBuilder()
            .ifString()
            .thenUnset()
            .end();

        expect(finalizeTestBuilder(builder)).to.deep.equal({});
    });

    it('should throw if no if part is set', () => {
        const builder = testBuilder();
        expect(builder.end.bind(builder)).to.throw(RuntimeException);
    });

    it('should throw if no than part is set', () => {
        const builder = testBuilder()
            .ifString();
        expect(builder.end.bind(builder)).to.throw(RuntimeException);
    });
});
