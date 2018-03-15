const NodeDefinition = Jymfony.Component.Config.Definition.Builder.NodeDefinition;
const VariableNode = Jymfony.Component.Config.Definition.VariableNode;

/**
 * This class provides a fluent interface for defining a node.
 *
 * @memberOf Jymfony.Component.Config.Definition.Builder
 */
class VariableNodeDefinition extends NodeDefinition {
    /**
     * Instantiate a Node.
     *
     * @return VariableNode The node
     */
    instantiateNode() {
        return new VariableNode(this._name, this._parent);
    }

    /**
     * {@inheritdoc}
     */
    createNode() {
        const node = this.instantiateNode();

        if (undefined !== this._normalization) {
            node.setNormalizationClosures(this._normalization.$before);
        }

        if (undefined !== this._merge) {
            node.setAllowOverwrite(this._merge.allowOverwrite);
        }

        if (true === this._default) {
            node.setDefaultValue(this._default);
        }

        node.setAllowEmptyValue(this._allowEmptyValue);
        node.addEquivalentValue(null, this._nullEquivalent);
        node.addEquivalentValue(true, this._trueEquivalent);
        node.addEquivalentValue(false, this._falseEquivalent);
        node.setRequired(this._required);
        node.setDeprecated(this._deprecationMessage);

        if (undefined !== this._validation) {
            node.setFinalValidationClosures(this._validation.rules);
        }

        return node;
    }
}

module.exports = VariableNodeDefinition;
