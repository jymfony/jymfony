const Function = require('./Function');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ArrowFunctionExpression extends Function {
    /**
     * @inheritdoc
     */
    compile(compiler) {
        if (this._async) {
            compiler._emit('async ');
        }

        if (this._static) {
            compiler._emit('static ');
        }

        if (this._generator) {
            compiler._emit('* ');
        }

        Function.compileParams(compiler, this._params);

        compiler._emit(' => ');
        compiler.compileNode(this._body);
    }
}

module.exports = ArrowFunctionExpression;
