const FloatNode = Jymfony.Component.Config.Definition.FloatNode;
const NumericNodeDefinition = Jymfony.Component.Config.Definition.Builder.NumericNodeDefinition;

/**
 * This class provides a fluent interface for defining a float node.
 *
 * @memberOf Jymfony.Component.Config.Definition.Builder
 */
class FloatNodeDefinition extends NumericNodeDefinition {
    /**
     * Instantiate a Node.
     *
     * @returns {Jymfony.Component.Config.Definition.FloatNode} The node
     */
    instantiateNode() {
        return new FloatNode(this._name, this._parent, this._min, this._max);
    }
}

module.exports = FloatNodeDefinition;
