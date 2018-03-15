const ExprBuilder = Jymfony.Component.Config.Definition.Builder.ExprBuilder;

/**
 * This class builds normalization conditions.
 *
 * @memberOf Jymfony.Component.Config.Definition.Builder
 */
class NormalizationBuilder {
    __construct(node) {
        this.node = node;
        this.$before = [];
        this.$remappings = [];
    }

    /**
     * Registers a key to remap to its plural form.
     *
     * @param {string} key    The key to remap
     * @param {string} plural The plural of the key in case of irregular plural
     *
     * @return $this
     */
    remap(key, plural = undefined) {
        this.$remappings.push([ key, undefined === plural ? key+'s' : plural ]);

        return this;
    }

    /**
     * Registers a closure to run before the normalization or an expression builder to build it if null is provided.
     *
     * @return ExprBuilder|$this
     */
    before(closure = undefined) {
        if (undefined !== closure) {
            this.$before.push(closure);

            return this;
        }

        const expr = new ExprBuilder(this.node);
        this.$before.push(expr);

        return expr;
    }
}

module.exports = NormalizationBuilder;
