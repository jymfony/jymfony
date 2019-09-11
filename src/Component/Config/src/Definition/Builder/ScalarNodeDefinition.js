const VariableNodeDefinition = Jymfony.Component.Config.Definition.Builder.VariableNodeDefinition;
const ScalarNode = Jymfony.Component.Config.Definition.ScalarNode;

/**
 * This class provides a fluent interface for defining a node.
 *
 * @memberOf Jymfony.Component.Config.Definition.Builder
 */
export default class ScalarNodeDefinition extends VariableNodeDefinition {
    /**
     * @inheritdoc
     */
    instantiateNode() {
        return new ScalarNode(this._name, this._parent);
    }
}
