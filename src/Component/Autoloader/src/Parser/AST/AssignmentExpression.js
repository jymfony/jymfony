const ExpressionInterface = require('./ExpressionInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class AssignmentExpression extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {string} operator
     * @param {Jymfony.Component.Autoloader.Parser.AST.PatternInterface|Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} left
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
         * @type {Jymfony.Component.Autoloader.Parser.AST.PatternInterface|Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
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

    /**
     * Gets the assignment operator.
     *
     * @returns {string}
     */
    get operator() {
        return this._operator;
    }

    /**
     * Gets the left hand of the expression.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.PatternInterface|Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
     */
    get left() {
        return this._left;
    }

    /**
     * Gets the right hand of the expression.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
     */
    get right() {
        return this._right;
    }
}

module.exports = AssignmentExpression;
