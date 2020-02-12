const Literal = require('./Literal');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class NullLiteral extends Literal {
    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('null');
    }
}

module.exports = NullLiteral;
