const ClassMemberInterface = require('./ClassMemberInterface');
const Identifier = require('./Identifier');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ClassProperty extends implementationOf(ClassMemberInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} key
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} value
     * @param {boolean} Static
     */
    __construct(location, key, value, Static) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
         *
         * @private
         */
        this._key = key;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
         *
         * @private
         */
        this._value = value;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._static = Static;

        /**
         * @type {null|string}
         */
        this.docblock = null;

        /**
         * @type {null|[string, Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface][]}
         */
        this.decorators = null;
    }

    /**
     * Gets the key.
     *
     * @return {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
     */
    get key() {
        return this._key;
    }

    /**
     * Whether this method is static.
     *
     * @return {boolean}
     */
    get static() {
        return this._static;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        if (this._static) {
            compiler._emit('static ');
        }

        if (this._key instanceof Identifier) {
            compiler.compileNode(this._key);
        } else {
            compiler._emit('[');
            compiler.compileNode(this._key);
            compiler._emit(']');
        }

        if (null !== this._value) {
            compiler._emit(' = ');
            compiler.compileNode(this._value);
        }
    }
}

module.exports = ClassProperty;
