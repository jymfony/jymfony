const Literal = require('./Literal');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class BooleanLiteral extends Literal {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {boolean} value
     */
    __construct(location, value) {
        super.__construct(location);

        /**
         * @type {boolean}
         *
         * @private
         */
        this._value = value;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit(this._value ? 'true' : 'false');
    }
}

module.exports = BooleanLiteral;
