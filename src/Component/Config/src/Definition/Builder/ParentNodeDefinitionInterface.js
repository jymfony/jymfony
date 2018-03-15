/**
 * An interface that must be implemented by nodes which can have children.
 *
 * @memberOf Jymfony.Component.Config.Definition.Builder
 */
class ParentNodeDefinitionInterface
{
    children() { }

    append(node) { }

    setBuilder(builder) { }
}

module.exports = getInterface(ParentNodeDefinitionInterface);
