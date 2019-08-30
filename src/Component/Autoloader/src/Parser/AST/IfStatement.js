const StatementInterface = require('./StatementInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class IfStatement extends implementationOf(StatementInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} test
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} consequent
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} alternate
     */
    __construct(location, test, consequent, alternate = null) {
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
         * @type {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
         *
         * @private
         */
        this._consequent = consequent;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
         *
         * @private
         */
        this._alternate = alternate;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('if (');
        compiler.compileNode(this._test);
        compiler._emit(') ');
        compiler.compileNode(this._consequent);
        compiler._emit('\n');

        if (null !== this._alternate) {
            compiler._emit(' else ');
            compiler.compileNode(this._alternate);
        }
    }
}

module.exports = IfStatement;
