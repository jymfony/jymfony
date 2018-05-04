const IntegerNode = Jymfony.Component.Config.Definition.IntegerNode;
const NumericNodeDefinition = Jymfony.Component.Config.Definition.Builder.NumericNodeDefinition;

/**
 * This class provides a fluent interface for defining a integer node.
 *
 * @memberOf Jymfony.Component.Config.Definition.Builder
 */
class IntegerNodeDefinition extends NumericNodeDefinition {
    /**
     * @inheritdoc
     */
    instantiateNode() {
        return new IntegerNode(this._name, this._parent, this._min, this._max);
    }
}

module.exports = IntegerNodeDefinition;
