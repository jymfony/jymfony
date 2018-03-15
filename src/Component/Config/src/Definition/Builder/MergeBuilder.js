/**
 * This class builds merge conditions.
 *
 * @memberOf Jymfony.Component.Config.Definition.Builder
 */
class MergeBuilder {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Config.Definition.Builder.NodeDefinition} node
     */
    __construct(node) {
        /**
         * @type {Jymfony.Component.Config.Definition.Builder.NodeDefinition}
         * @protected
         */
        this._node = node;

        this.allowFalse = false;
        this.allowOverwrite = true;
    }

    /**
     * Sets whether the node can be unset.
     *
     * @param {boolean} allow
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.MergeBuilder}
     */
    allowUnset(allow = true) {
        this.allowFalse = allow;

        return this;
    }

    /**
     * Sets whether the node can be overwritten.
     *
     * @param {boolean} deny Whether the overwriting is forbidden or not
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.MergeBuilder}
     */
    denyOverwrite(deny = true) {
        this.allowOverwrite = ! deny;

        return this;
    }

    /**
     * Returns the related node.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeDefinition|Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition|Jymfony.Component.Config.Definition.Builder.VariableNodeDefinition}
     */
    end() {
        return this._node;
    }
}

module.exports = MergeBuilder;
