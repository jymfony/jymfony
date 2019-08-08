const StatementInterface = require('./StatementInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ForStatement extends implementationOf(StatementInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {null|Jymfony.Component.Autoloader.Parser.AST.VariableDeclaration|Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} init
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} test
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} update
     * @param {Jymfony.Component.Autoloader.Parser.AST.StatementInterface} body
     */
    __construct(location, init, test, update, body) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {null|Jymfony.Component.Autoloader.Parser.AST.VariableDeclaration|Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
         *
         * @private
         */
        this._init = init;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
         *
         * @private
         */
        this._test = test;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
         *
         * @private
         */
        this._update = update;

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

        if (null !== this._init) {
            compiler.compileNode(this._init);
        }
        compiler._emit(';');

        if (null !== this._test) {
            compiler.compileNode(this._test);
        }
        compiler._emit(';');

        if (null !== this._update) {
            compiler.compileNode(this._update);
        }
        compiler._emit(')');

        compiler.compileNode(this._body);
    }
}

module.exports = ForStatement;
