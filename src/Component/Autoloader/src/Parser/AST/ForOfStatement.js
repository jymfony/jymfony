const ForInStatement = require('./ForInStatement');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ForOfStatement extends ForInStatement {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.VariableDeclaration|Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} left
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} right
     * @param {Jymfony.Component.Autoloader.Parser.AST.StatementInterface} body
     * @param {boolean} _await
     */
    __construct(location, left, right, body, _await) {
        super.__construct(location, left, right, body);

        /**
         * @type {boolean}
         *
         * @private
         */
        this._await = _await;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('for ');
        if (this._await) {
            compiler._emit('await ');
        }

        compiler._emit('(');
        compiler.compileNode(this._left);
        compiler._emit(' of ');
        compiler.compileNode(this._right);
        compiler._emit(')');

        compiler.compileNode(this._body);
    }
}

module.exports = ForOfStatement;
