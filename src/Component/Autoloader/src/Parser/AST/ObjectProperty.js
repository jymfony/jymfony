const Identifier = require('./Identifier');
const ObjectMember = require('./ObjectMember');
const StringLiteral = require('./StringLiteral');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ObjectProperty extends implementationOf(ObjectMember) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} key
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} value
     */
    __construct(location, key, value) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
         *
         * @protected
         */
        this._key = key;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
         *
         * @protected
         */
        this._value = value;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        if (this._key instanceof Identifier || this._key instanceof StringLiteral) {
            compiler.compileNode(this._key);
        } else {
            compiler._emit('[');
            compiler.compileNode(this._key);
            compiler._emit(']');
        }

        if (null !== this._value) {
            compiler._emit(': ');
            compiler.compileNode(this._value);
        }
    }
}

module.exports = ObjectProperty;
