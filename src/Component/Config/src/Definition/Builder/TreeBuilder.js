const NodeParentInterface = Jymfony.Component.Config.Definition.Builder.NodeParentInterface;
const NodeBuilder = Jymfony.Component.Config.Definition.Builder.NodeBuilder;

/**
 * This is the entry class for building a config tree.
 *
 * @memberOf Jymfony.Component.Config.Definition.Builder
 */
class TreeBuilder extends implementationOf(NodeParentInterface) {
    __construct() {
        /**
         * @type {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition|Jymfony.Component.Config.Definition.Builder.NodeDefinition}
         *
         * @private
         */
        this._root = undefined;

        /**
         * @type {Jymfony.Component.Config.Definition.NodeInterface}
         *
         * @private
         */
        this._tree = undefined;
    }

    /**
     * Creates the root node.
     *
     * @param {string} name The name of the root node
     * @param {string} [type = 'array'] The type of the root node
     * @param {Jymfony.Component.Config.Definition.Builder.NodeBuilder} [builder] A custom node builder instance
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition|Jymfony.Component.Config.Definition.Builder.NodeDefinition} The root node (as an ArrayNodeDefinition when the type is 'array')
     *
     * @throws {RuntimeException} When the node type is not supported
     */
    root(name, type = 'array', builder = undefined) {
        builder = builder || new NodeBuilder();

        return this._root = builder.node(name, type).setParent(this);
    }

    /**
     * Builds the tree.
     *
     * @returns {Jymfony.Component.Config.Definition.NodeInterface}
     *
     * @throws {RuntimeException}
     */
    buildTree() {
        if (undefined === this._root) {
            throw new RuntimeException('The configuration tree has no root node.');
        }

        if (undefined !== this._tree) {
            return this._tree;
        }

        return this._tree = this._root.getNode(true);
    }
}


module.exports = TreeBuilder;
