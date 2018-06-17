const BooleanNode = Jymfony.Component.Config.Definition.BooleanNode;
const ScalarNodeDefinition = Jymfony.Component.Config.Definition.Builder.ScalarNodeDefinition;
const InvalidDefinitionException = Jymfony.Component.Config.Definition.Exception.InvalidDefinitionException;

/**
 * This class provides a fluent interface for defining a node.
 *
 * @memberOf Jymfony.Component.Config.Definition.Builder
 */
class BooleanNodeDefinition extends ScalarNodeDefinition {
    /**
     * @inheritdoc
     */
    __construct(name, parent = undefined) {
        super.__construct(name, parent);

        this._nullEquivalent = true;
    }

    /**
     * @inheritdoc
     */
    instantiateNode() {
        return new BooleanNode(this._name, this._parent);
    }

    /**
     * Denies the node value being empty.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeDefinition}
     *
     * @throws {Jymfony.Component.Config.Definition.Exception.InvalidDefinitionException}
     */
    cannotBeEmpty() {
        throw new InvalidDefinitionException('cannotBeEmpty() is not applicable to BooleanNodeDefinition.');
    }
}

module.exports = BooleanNodeDefinition;
