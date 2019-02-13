declare namespace Jymfony.Component.Config.Definition.Builder {
    import NodeInterface = Jymfony.Component.Config.Definition.NodeInterface;

    export class TreeBuilder extends implementationOf(NodeParentInterface) {
        private _root: ArrayNodeDefinition|NodeDefinition;
        private _tree?: NodeInterface;

        /**
         * Constructor.
         *
         *  @throws {RuntimeException} When the node type is not supported
         */
        __construct(name: string, type?: string, builder?: NodeBuilder): void;
        constructor(name: string, type?: string, builder?: NodeBuilder);

        /**
         * Gets the root node definition.
         */
        readonly rootNode: ArrayNodeDefinition|NodeDefinition;

        /**
         * Builds the tree.
         *
         * @throws {RuntimeException}
         */
        buildTree(): NodeInterface;
    }
}
