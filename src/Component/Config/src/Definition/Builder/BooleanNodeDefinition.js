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
     * @inheritDoc
     */
    __construct(name, parent = undefined) {
        super.__construct(name, parent);

        this._nullEquivalent = true;
    }

    /**
     * Instantiate a Node.
     *
     * @returns {Jymfony.Component.Config.Definition.BooleanNode} The node
     */
    instantiateNode() {
        return new BooleanNode(this._name, this._parent);
    }

    /**
     * @inheritDoc
     *
     * @throws {InvalidDefinitionException}
     */
    cannotBeEmpty() {
        throw new InvalidDefinitionException('cannotBeEmpty() is not applicable to BooleanNodeDefinition.');
    }
}

module.exports = BooleanNodeDefinition;
