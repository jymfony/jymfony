const Namespace = Jymfony.Component.Autoloader.Namespace;
const NodeBuilder = Jymfony.Component.Config.Definition.Builder.NodeBuilder;
const expect = require('chai').expect;
const path = require('path');

const Fixtures = new Namespace(__jymfony.autoload, 'Jymfony.Component.Config.Fixtures', [
    path.join(__dirname, '..', '..', '..', 'fixtures'),
]);

describe('[Config] NodeBuilder', function () {
    it('should throw if an unknown node type is requested', () => {
        const builder = new NodeBuilder();
        expect(builder.node.bind(builder, 'bar', 'foobar')).to.throw(RuntimeException);
    });

    it('should throw if node class could not be found', () => {
        const builder = new NodeBuilder();
        builder.setNodeClass('foobar', 'Not.Existent.Class');
        expect(builder.node.bind(builder, 'bar', 'foobar')).to.throw(RuntimeException);
    });

    it('custom node class should be set', () => {
        const builder = new NodeBuilder();
        builder.setNodeClass('foobar', Fixtures.Definition.SomeNodeClass);
        expect(builder.node('bar', 'foobar')).to.be.instanceOf(Fixtures.Definition.SomeNodeClass);
    });

    it('node class should be overridable', () => {
        const builder = new NodeBuilder();
        builder.setNodeClass('variable', Fixtures.Definition.SomeNodeClass);
        expect(builder.node('bar', 'variable')).to.be.instanceOf(Fixtures.Definition.SomeNodeClass);
    });

    it('node types should not be case sensitive', () => {
        const builder = new NodeBuilder();
        const node1 = builder.node('bar', 'variable');
        const node2 = builder.node('bar', 'VaRiABle');

        expect(node2).to.be.instanceOf(ReflectionClass.getClass(node1));
    });
});
