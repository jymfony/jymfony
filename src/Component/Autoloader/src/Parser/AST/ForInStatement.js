const StatementInterface = require('./StatementInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ForInStatement extends implementationOf(StatementInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.VariableDeclaration|Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} left
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} right
     * @param {Jymfony.Component.Autoloader.Parser.AST.StatementInterface} body
     */
    __construct(location, left, right, body) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.VariableDeclaration|Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
         *
         * @private
         */
        this._left = left;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
         *
         * @private
         */
        this._right = right;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.StatementInterface}
         *
         * @private
         */
        this._body = body;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('for (');
        compiler.compileNode(this._left);
        compiler._emit(' in ');
        compiler.compileNode(this._right);
        compiler._emit(')');

        compiler.compileNode(this._body);
    }
}

module.exports = ForInStatement;
