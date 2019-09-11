const CallExpression = require('./CallExpression');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class NewExpression extends CallExpression {
    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('new ');
        super.compile(compiler);
    }
}

module.exports = NewExpression;
