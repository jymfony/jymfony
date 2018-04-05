const ExprBuilder = Jymfony.Component.Config.Definition.Builder.ExprBuilder;

/**
 * This class builds validation conditions.
 *
 * @memberOf Jymfony.Component.Config.Definition.Builder
 */
class ValidationBuilder {
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

        this.rules = [];
    }

    /**
     * Sets whether the node can be unset.
     *
     * @param {Function|undefined} closure
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ExprBuilder|Jymfony.Component.Config.Definition.Builder.ValidationBuilder}
     */
    rule(closure = undefined) {
        if (undefined !== closure) {
            this.rules.push(closure);


            return this;
        }

        const expr = new ExprBuilder(this._node);
        this.rules.push(expr);

        return expr;
    }
}

module.exports = ValidationBuilder;
