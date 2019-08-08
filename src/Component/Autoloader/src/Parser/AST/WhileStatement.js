const StatementInterface = require('./StatementInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class WhileStatement extends implementationOf(StatementInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} test
     * @param {Jymfony.Component.Autoloader.Parser.AST.StatementInterface} body
     */
    __construct(location, test, body) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
         *
         * @private
         */
        this._test = test;

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
        compiler._emit('while (');
        compiler.compileNode(this._test);
        compiler._emit(')');

        compiler.compileNode(this._body);
    }
}

module.exports = WhileStatement;
