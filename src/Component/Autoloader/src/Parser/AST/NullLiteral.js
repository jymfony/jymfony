const Literal = require('./Literal');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class NullLiteral extends Literal {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     */
    __construct(location) {
        super.__construct(location);
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('null');
    }
}

module.exports = NullLiteral;
