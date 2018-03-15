const EnumNode = Jymfony.Component.Config.Definition.EnumNode;
const ScalarNodeDefinition = Jymfony.Component.Config.Definition.Builder.ScalarNodeDefinition;

/**
 * Enum Node Definition.
 *
 * @memberOf Jymfony.Component.Config.Definition.Builder
 */
class EnumNodeDefinition extends ScalarNodeDefinition {
    /**
     * @inheritDoc
     */
    __construct(name, parent = undefined) {
        super.__construct(name, parent);

        /**
         * @type {Array}
         * @private
         */
        this._values = undefined;
    }

    /**
     * Sets allowed values for this node.
     *
     * @param {Array} values
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.EnumNodeDefinition}
     */
    values(values) {
        values = [ ...new Set(values) ];

        if (0 === values.length) {
            throw new InvalidArgumentException('values() must be called with at least one value.');
        }

        this._values = values;

        return this;
    }

    /**
     * Instantiate a Node.
     *
     * @returns {Jymfony.Component.Config.Definition.EnumNode} The node
     */
    instantiateNode() {
        if (undefined === this._values) {
            throw new RuntimeException('You must call values() on enum nodes.');
        }

        return new EnumNode(this._name, this._parent);
    }
}

module.exports = EnumNodeDefinition;
