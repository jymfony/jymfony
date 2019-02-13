declare namespace Jymfony.Component.Config.Definition.Builder {
    import ScalarNode = Jymfony.Component.Config.Definition.ScalarNode;

    /**
     * This class provides a fluent interface for defining a node.
     */
    export class ScalarNodeDefinition<T extends NodeDefinition = any> extends VariableNodeDefinition<T> {
        /**
         * @inheritdoc
         */
        instantiateNode(): ScalarNode;
    }
}
