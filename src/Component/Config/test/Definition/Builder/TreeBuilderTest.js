const Fixtures = Jymfony.Component.Config.Fixtures;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const TreeBuilder = Jymfony.Component.Config.Definition.Builder.TreeBuilder;

export default class TreeBuilderTest extends TestCase {
    get testCaseName() {
        return '[Config] ' + super.testCaseName;
    }

    testShouldUseCustomBuilder() {
        const builder = new TreeBuilder('custom', 'array', new Fixtures.Definition.CustomNodeBuilder(Fixtures));
        const nodeBuilder = builder.rootNode.children();

        __self.assertInstanceOf(Fixtures.Definition.CustomNodeBuilder, nodeBuilder);
        __self.assertInstanceOf(Fixtures.Definition.CustomNodeBuilder, nodeBuilder.arrayNode('deeper').children());
    }

    testBuiltinNodeTypeShouldBeOverridable() {
        const builder = new TreeBuilder('custom', 'array', new Fixtures.Definition.CustomNodeBuilder(Fixtures));
        const nodeBuilder = builder.rootNode.children();

        __self.assertInstanceOf(Fixtures.Definition.CustomNodeBuilder, nodeBuilder);
        __self.assertInstanceOf(Fixtures.Definition.VariableNodeDefinition, nodeBuilder.variableNode('variable'));
    }

    testNodeTypeCouldBeAdded() {
        const builder = new TreeBuilder('custom', 'array', new Fixtures.Definition.CustomNodeBuilder(Fixtures));
        const nodeBuilder = builder.rootNode.children();

        __self.assertInstanceOf(Fixtures.Definition.CustomNodeBuilder, nodeBuilder);
        __self.assertInstanceOf(Fixtures.Definition.BarNodeDefinition, nodeBuilder.barNode('variable'));
    }

    testPrototypedArrayShouldUseCustomNodeBuilder() {
        const builder = new TreeBuilder('override', 'array', new Fixtures.Definition.CustomNodeBuilder(Fixtures));
        const root = builder.rootNode;

        root.prototype('bar').end();
        __self.assertInstanceOf(Fixtures.BarNode, root.getNode(true).getPrototype());
    }

    testExtendedNodeBuilderShouldBePropagatedToChildren() {
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

        __self.assertInstanceOf(Jymfony.Component.Config.Definition.BooleanNode, children.foo);

        const childChildren = children.child.getChildren();
        __self.assertInstanceOf(Jymfony.Component.Config.Definition.BooleanNode, childChildren.foo);
    }

    testDefinitionInfoShouldBeInjectedInTheNode() {
        const builder = new TreeBuilder('test');
        builder.rootNode.info('root info')
            .children()
            .node('child', 'variable').info('child info').defaultValue('default').end()
            .end();

        const node = builder.buildTree();
        const children = node.getChildren();

        __self.assertEquals('root info', node.getInfo());
        __self.assertEquals('child info', children.child.getInfo());
    }

    testDefinitionExampleShouldBeInjectedInTheNode() {
        const builder = new TreeBuilder('test');
        builder.rootNode
            .example({ key: 'value' })
            .children()
            .node('child', 'variable').info('child info').defaultValue('default').example('example').end()
            .end();

        const node = builder.buildTree();
        const children = node.getChildren();

        __self.assertEquals({ key: 'value' }, node.getExample());
        __self.assertEquals('example', children.child.getExample());
    }
}
