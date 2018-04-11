const Builder = Jymfony.Component.Config.Definition.Builder;
const expect = require('chai').expect;

describe('[Config] NumericNodeDefinition', function () {
    it('incoherent min assertion should throw', () => {
        const node = new Builder.IntegerNodeDefinition('foo');
        node.max(3);
        expect(node.min.bind(node, 4)).to.throw(InvalidArgumentException);
    });

    it('incoherent max assertion should throw', () => {
        const node = new Builder.IntegerNodeDefinition('foo');
        node.min(3);
        expect(node.max.bind(node, 2)).to.throw(InvalidArgumentException);
    });

    it('failed integer min assertion should throw', () => {
        const def = new Builder.IntegerNodeDefinition('foo');
        def.min(3);

        const node = def.getNode();
        expect(node.finalize.bind(node, 2))
            .to.throw(Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException);
    });

    it('failed integer max assertion should throw', () => {
        const def = new Builder.IntegerNodeDefinition('foo');
        def.max(3);

        const node = def.getNode();
        expect(node.finalize.bind(node, 4))
            .to.throw(Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException);
    });

    it('integer min max valid should work', () => {
        const node = new Builder.IntegerNodeDefinition('foo');
        node.min(2).max(4);
        expect(node.getNode().finalize(3)).to.be.equal(3);
    });

    it('failed float min assertion should throw', () => {
        const def = new Builder.FloatNodeDefinition('foo');
        def.min(5e2);

        const node = def.getNode();
        expect(node.finalize.bind(node, 4e2))
            .to.throw(Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException);
    });

    it('failed float max assertion should throw', () => {
        const def = new Builder.FloatNodeDefinition('foo');
        def.max(.3);

        const node = def.getNode();
        expect(node.finalize.bind(node, 4.3))
            .to.throw(Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException);
    });

    it('float min max valid should work', () => {
        const node = new Builder.FloatNodeDefinition('foo');
        node.min(3.0).max(7e2);
        expect(node.getNode().finalize(4.0)).to.be.equal(4.0);
    });

    it('cannot be empty should throw', () => {
        const node = new Builder.IntegerNodeDefinition('root');

        expect(node.cannotBeEmpty.bind(node))
            .to.throw(Jymfony.Component.Config.Definition.Exception.InvalidDefinitionException);
    });
});
