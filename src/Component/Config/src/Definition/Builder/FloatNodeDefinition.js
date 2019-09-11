const FloatNode = Jymfony.Component.Config.Definition.FloatNode;
const NumericNodeDefinition = Jymfony.Component.Config.Definition.Builder.NumericNodeDefinition;

/**
 * This class provides a fluent interface for defining a float node.
 *
 * @memberOf Jymfony.Component.Config.Definition.Builder
 */
export default class FloatNodeDefinition extends NumericNodeDefinition {
    /**
     * @inheritdoc
     */
    instantiateNode() {
        return new FloatNode(this._name, this._parent, this._min, this._max);
    }
}
