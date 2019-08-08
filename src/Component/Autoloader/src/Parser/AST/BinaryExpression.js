const ExpressionInterface = require('./ExpressionInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class BinaryExpression extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {string} operator
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} left
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} right
     */
    __construct(location, operator, left, right) {
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
        this._left = left;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
         *
         * @private
         */
        this._right = right;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler.compileNode(this._left);
        compiler._emit(' ' + this._operator + ' ');
        compiler.compileNode(this._right);
    }
}

module.exports = BinaryExpression;
