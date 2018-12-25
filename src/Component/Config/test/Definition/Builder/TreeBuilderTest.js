const Namespace = Jymfony.Component.Autoloader.Namespace;
const TreeBuilder = Jymfony.Component.Config.Definition.Builder.TreeBuilder;
const expect = require('chai').expect;
const path = require('path');

const Fixtures = new Namespace(__jymfony.autoload, 'Jymfony.Component.Config.Fixtures', [
    path.join(__dirname, '..', '..', '..', 'fixtures'),
]);

describe('[Config] TreeBuilder', function () {
    it('should use custom builder', () => {
        const builder = new TreeBuilder('custom', 'array', new Fixtures.Definition.CustomNodeBuilder(Fixtures));
        const nodeBuilder = builder.rootNode.children();

        expect(nodeBuilder).to.be.instanceOf(Fixtures.Definition.CustomNodeBuilder);
        expect(nodeBuilder.arrayNode('deeper').children()).to.be.instanceOf(Fixtures.Definition.CustomNodeBuilder);
    });

    it('builtin node type should be overridable', () => {
        const builder = new TreeBuilder('custom', 'array', new Fixtures.Definition.CustomNodeBuilder(Fixtures));
        const nodeBuilder = builder.rootNode.children();

        expect(nodeBuilder).to.be.instanceOf(Fixtures.Definition.CustomNodeBuilder);
        expect(nodeBuilder.variableNode('variable')).to.be.instanceOf(Fixtures.Definition.VariableNodeDefinition);
    });

    it('node type could be added', () => {
        const builder = new TreeBuilder('custom', 'array', new Fixtures.Definition.CustomNodeBuilder(Fixtures));
        const nodeBuilder = builder.rootNode.children();

        expect(nodeBuilder).to.be.instanceOf(Fixtures.Definition.CustomNodeBuilder);
        expect(nodeBuilder.barNode('variable')).to.be.instanceOf(Fixtures.Definition.BarNodeDefinition);
    });

    it('prototyped array should use custom node builder', () => {
        const builder = new TreeBuilder('override', 'array', new Fixtures.Definition.CustomNodeBuilder(Fixtures));
        const root = builder.rootNode;

        root.prototype('bar').end();
        expect(root.getNode(true).getPrototype()).to.be.instanceOf(Fixtures.BarNode);
    });

    it('extended node builder should be propagated to children', () => {
        const builder = new TreeBuilder('propagation');
        builder.rootNode
            .children()
            .setNodeClass('extended', Jymfony.Component.Config.Definition.Builder.BooleanNodeDefinition)
            .node('foo', 'extended').end()
            .arrayNode('child')
            .children()
            .node('foo', 'extended').end()
            .end()
            .end()
            .end();

        const node = builder.buildTree();
        const children = node.getChildren();

        expect(children.foo).to.be.instanceOf(Jymfony.Component.Config.Definition.BooleanNode);

        const childChildren = children.child.getChildren();
        expect(childChildren.foo).to.be.instanceOf(Jymfony.Component.Config.Definition.BooleanNode);
    });

    it('definition info should be injected in the node', () => {
        const builder = new TreeBuilder('test');
        builder.rootNode.info('root info')
            .children()
            .node('child', 'variable').info('child info').defaultValue('default').end()
            .end();

        const node = builder.buildTree();
        const children = node.getChildren();

        expect(node.getInfo()).to.be.equal('root info');
        expect(children.child.getInfo()).to.be.equal('child info');
    });

    it('definition example should be injected in the node', () => {
        const builder = new TreeBuilder('test');
        builder.rootNode
            .example({ key: 'value' })
            .children()
            .node('child', 'variable').info('child info').defaultValue('default').example('example').end()
            .end();

        const node = builder.buildTree();
        const children = node.getChildren();

        expect(node.getExample()).to.be.deep.equal({ key: 'value' });
        expect(children.child.getExample()).to.be.equal('example');
    });
});
