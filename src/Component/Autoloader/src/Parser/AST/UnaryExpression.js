const ExpressionInterface = require('./ExpressionInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class UnaryExpression extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {string} operator
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} argument
     */
    __construct(location, operator, argument) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {string}
         *
         * @private
         */
        this._operator = operator;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
         *
         * @private
         */
        this._argument = argument;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit(this._operator + ' ');
        compiler.compileNode(this._argument);
    }
}

module.exports = UnaryExpression;
