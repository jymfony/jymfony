const UnsetKeyException = Jymfony.Component.Config.Definition.Exception.UnsetKeyException;

/**
 * This class builds an if expression.
 *
 * @memberOf Jymfony.Component.Config.Definition.Builder
 */
class ExprBuilder {
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

        this.ifPart = undefined;
        this.thenPart = undefined;
    }

    /**
     * Marks the expression as being always used.
     *
     * @param {Function} then
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ExprBuilder}
     */
    always(then = undefined) {
        this.ifPart = () => true;

        if (undefined !== then) {
            this.thenPart = then;
        }

        return this;
    }

    /**
     * Sets a closure to use as tests.
     *
     * The default one tests if the value is true.
     *
     * @param {Function} closure
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ExprBuilder}
     */
    ifTrue(closure = undefined) {
        if (undefined === closure) {
            closure = (v) => true === v;
        }

        this.ifPart = closure;

        return this;
    }

    /**
     * Tests if the value is a string.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ExprBuilder}
     */
    ifString() {
        this.ifPart = (v) => isString(v);

        return this;
    }

    /**
     * Tests if the value is null.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ExprBuilder}
     */
    ifNull() {
        this.ifPart = (v) => null === v;

        return this;
    }

    /**
     * Tests if the value is empty.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ExprBuilder}
     */
    ifEmpty() {
        this.ifPart = (v) => !v;

        return this;
    }

    /**
     * Tests if the value is an array.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ExprBuilder}
     */
    ifArray() {
        this.ifPart = (v) => isArray(v) || isObjectLiteral(v);

        return this;
    }

    /**
     * Tests if the value is in an array.
     *
     * @param {Array} array
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ExprBuilder}
     */
    ifInArray(array) {
        this.ifPart = (v) => -1 !== array.indexOf(v);

        return this;
    }

    /**
     * Tests if the value is not in an array.
     *
     * @param {Array} array
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ExprBuilder}
     */
    ifNotInArray(array) {
        this.ifPart = (v) => -1 === array.indexOf(v);

        return this;
    }

    /**
     * Transforms variables of any type into an array.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ExprBuilder}
     */
    castToArray() {
        this.ifPart = (v) => !isArray(v);
        this.thenPart = (v) => [ v ];

        return this;
    }

    /**
     * Sets the closure to run if the test pass.
     *
     * @param {Function} closure
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ExprBuilder}
     */
    then(closure) {
        this.thenPart = closure;

        return this;
    }

    /**
     * Sets a closure returning an empty array.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ExprBuilder}
     */
    thenEmptyArray() {
        this.thenPart = () => [];

        return this;
    }

    /**
     * Sets a closure marking the value as invalid at validation time.
     *
     * if you want to add the value of the node in your message just use a %s placeholder.
     *
     * @param {string} message
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ExprBuilder}
     *
     * @throws {InvalidArgumentException}
     */
    thenInvalid(message) {
        this.thenPart = (v) => {
            throw new InvalidArgumentException(__jymfony.sprintf(message, JSON.stringify(v)));
        };

        return this;
    }

    /**
     * Sets a closure unsetting this key of the array at validation time.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ExprBuilder}
     *
     * @throws UnsetKeyException
     */
    thenUnset() {
        this.thenPart = () => {
            throw new UnsetKeyException('Unsetting key');
        };

        return this;
    }

    /**
     * Returns the related node.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeDefinition|Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition|Jymfony.Component.Config.Definition.Builder.VariableNodeDefinition}
     *
     * @throws {RuntimeException}
     */
    end() {
        if (undefined === this.ifPart) {
            throw new RuntimeException('You must specify an if part.');
        }

        if (undefined === this.thenPart) {
            throw new RuntimeException('You must specify a then part.');
        }

        return this._node;
    }

    /**
     * Builds the expressions.
     *
     * @param {[Jymfony.Component.Config.Definition.Builder.ExprBuilder]} expressions An array of ExprBuilder instances to build
     *
     * @returns {[Function]}
     */
    static buildExpressions(expressions) {
        const result = new HashTable();
        for (const [ k, expr ] of __jymfony.getEntries(expressions)) {
            if (expr instanceof __self) {
                const $if = expr.ifPart;
                const $then = expr.thenPart;
                result.put(k, (v) => {
                    return $if(v) ? $then(v) : v;
                });
            }
        }

        return result.toObject();
    }
}

module.exports = ExprBuilder;
