declare namespace Jymfony.Component.Config.Definition.Builder {
    /**
     * An interface that must be implemented by nodes which can have children.
     */
    export class ParentNodeDefinitionInterface<T extends NodeDefinition = any> {
        public static readonly definition: Newable<ParentNodeDefinitionInterface>;

        /**
         * Returns a builder to add children nodes.
         */
        children(): NodeBuilder<T>;

        /**
         * Appends a node definition.
         */
        append(node: NodeDefinition): this;

        /**
         * Sets a custom children builder.
         */
        setBuilder(builder: NodeBuilder<T>): void;
    }
}
