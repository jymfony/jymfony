/**
 * An interface that must be implemented by nodes which can have children.
 *
 * @memberOf Jymfony.Component.Config.Definition.Builder
 */
class ParentNodeDefinitionInterface
{
    children() { }

    /**
     * @param {Jymfony.Component.Config.Definition.Builder.NodeDefinition} node
     */
    append(node) { }

    /**
     * @param {Jymfony.Component.Config.Definition.Builder.TreeBuilder} builder
     */
    setBuilder(builder) { }
}

module.exports = getInterface(ParentNodeDefinitionInterface);
