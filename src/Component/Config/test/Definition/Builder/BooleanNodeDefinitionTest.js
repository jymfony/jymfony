const Builder = Jymfony.Component.Config.Definition.Builder;
const expect = require('chai').expect;

describe('[Config] BooleanNodeDefinition', function () {
    it('set deprecated should work', () => {
        const node = new Builder.BooleanNodeDefinition('foo');
        node.setDeprecated('The "%path%" node is deprecated.');

        const deprecatedNode = node.getNode();

        expect(deprecatedNode.isDeprecated()).to.be.true;
        expect(deprecatedNode.getDeprecationMessage(deprecatedNode.getName(), deprecatedNode.getPath()))
            .to.be.equal('The "foo" node is deprecated.');
    });

    it('cannot be empty should throw', () => {
        const node = new Builder.BooleanNodeDefinition('foo');

        expect(node.cannotBeEmpty.bind(node))
            .to.throw(Jymfony.Component.Config.Definition.Exception.InvalidDefinitionException);
    });
});
