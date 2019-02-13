declare namespace Jymfony.Component.Config.Definition.Builder {
    import VariableNode = Jymfony.Component.Config.Definition.VariableNode;

    /**
     * This class provides a fluent interface for defining a node.
     */
    export class VariableNodeDefinition<T extends NodeDefinition = any> extends NodeDefinition<T> {
        /**
         * Instantiate a Node.
         */
        instantiateNode(): VariableNode;

        /**
         * @inheritdoc
         */
        createNode(): VariableNode;
    }
}
