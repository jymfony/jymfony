const Literal = require('./Literal');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class StringLiteral extends Literal {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {string} value
     */
    __construct(location, value) {
        super.__construct(location);

        /**
         * @type {string}
         *
         * @private
         */
        this._value = value;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit(this._value);
    }
}

module.exports = StringLiteral;
