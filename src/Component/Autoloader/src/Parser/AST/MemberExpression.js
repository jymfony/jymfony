const ExpressionInterface = require('./ExpressionInterface');
const Identifier = require('./Identifier');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class MemberExpression extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} object
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} property
     * @param {boolean} computed
     * @param {boolean} optional
     */
    __construct(location, object, property, computed, optional = false) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
         *
         * @private
         */
        this._object = object;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
         *
         * @private
         */
        this._property = property;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._computed = computed;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._optional = optional;
    }

    /**
     * Gets the property accessed by this member access expression.
     *
     * @return {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
     */
    get property() {
        return this._property;
    }

    /**
     * Whether the object of the member expression is "this"
     *
     * @return {boolean}
     */
    get isObjectThis() {
        return this._object instanceof Identifier &&
            'this' === this._object.name;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler.compileNode(this._object);

        if (this._optional) {
            compiler._emit('?.');
        }

        if (this._computed) {
            compiler._emit('[');
            compiler.compileNode(this._property);
            compiler._emit(']');
        } else {
            if (! this._optional) {
                compiler._emit('.');
            }

            compiler.compileNode(this._property);
        }
    }
}

module.exports = MemberExpression;
