const Builder = Jymfony.Component.Config.Definition.Builder;
const { expect } = require('chai');

describe('[Config] EnumNodeDefinition', function () {
    it('with one value', () => {
        const def = new Builder.EnumNodeDefinition('foo');
        def.values([ 'foo' ]);

        const node = def.getNode();
        expect(node.getValues()).to.be.deep.equal([ 'foo' ]);
    });

    it('with one value distinct', () => {
        const def = new Builder.EnumNodeDefinition('foo');
        def.values([ 'foo', 'foo' ]);

        const node = def.getNode();
        expect(node.getValues()).to.be.deep.equal([ 'foo' ]);
    });

    it('no values passed should throw', () => {
        const node = new Builder.EnumNodeDefinition('foo');
        expect(node.getNode.bind(node)).to.throw(RuntimeException);
    });

    it('no values should throw', () => {
        const node = new Builder.EnumNodeDefinition('foo');
        expect(node.values.bind(node, [])).to.throw(InvalidArgumentException);
    });

    it('get node', () => {
        const def = new Builder.EnumNodeDefinition('foo');
        def.values([ 'foo', 'bar' ]);

        const node = def.getNode();
        expect(node.getValues()).to.be.deep.equal([ 'foo', 'bar' ]);
    });

    it('set deprecated should work', () => {
        const node = new Builder.EnumNodeDefinition('foo');
        node.values([ 'foo', 'bar' ]);
        node.setDeprecated('The "%path%" node is deprecated.');

        const deprecatedNode = node.getNode();

        expect(deprecatedNode.isDeprecated()).to.be.true;
        expect(deprecatedNode.getDeprecationMessage(deprecatedNode.getName(), deprecatedNode.getPath()))
            .to.be.equal('The "foo" node is deprecated.');
    });
});
