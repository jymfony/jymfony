declare namespace Jymfony.Component.Config.Definition.Builder {
    import IntegerNode = Jymfony.Component.Config.Definition.IntegerNode;

    /**
     * This class provides a fluent interface for defining a float node.
     */
    export class IntegerNodeDefinition<T extends NodeDefinition = any> extends NumericNodeDefinition<T> {
        /**
         * @inheritdoc
         */
        instantiateNode(): IntegerNode;
    }
}
