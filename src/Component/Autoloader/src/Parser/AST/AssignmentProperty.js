const Identifier = require('./Identifier');
const ObjectProperty = require('./ObjectProperty');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class AssignmentProperty extends ObjectProperty {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} key
     * @param {Jymfony.Component.Autoloader.Parser.AST.PatternInterface} value
     */
    __construct(location, key, value) {
        super.__construct(location, key, value);
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        if (this._key instanceof Identifier) {
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

module.exports = AssignmentProperty;
