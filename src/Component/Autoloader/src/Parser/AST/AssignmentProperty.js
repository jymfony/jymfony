const Identifier = require('./Identifier');
const ObjectProperty = require('./ObjectProperty');
const SpreadElement = require('./SpreadElement');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class AssignmentProperty extends ObjectProperty {
    /**
     * Gets the property key.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
     */
    get key() {
        return this._key;
    }

    /**
     * Gets the property value.
     *
     * @returns {null|Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
     */
    get value() {
        return this._value;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        if (this._key instanceof Identifier || this._key instanceof SpreadElement) {
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
