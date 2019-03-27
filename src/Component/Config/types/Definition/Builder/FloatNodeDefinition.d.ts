declare namespace Jymfony.Component.Config.Definition.Builder {
    import FloatNode = Jymfony.Component.Config.Definition.FloatNode;

    /**
     * This class provides a fluent interface for defining a integer node.
     */
    export class FloatNodeDefinition<T extends NodeDefinition = any> extends NumericNodeDefinition<T> {
        /**
         * @inheritdoc
         */
        instantiateNode(): FloatNode;
    }
}
