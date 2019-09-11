const AssignmentExpression = require('./AssignmentExpression');
const MemberExpression = require('./MemberExpression');
const StatementInterface = require('./StatementInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ExpressionStatement extends implementationOf(StatementInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} expression
     */
    __construct(location, expression) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
         *
         * @private
         */
        this._expression = expression;

        /**
         * @type {null|string}
         */
        this.docblock = null;
    }

    /**
     * Whether this expression is a possible field declaration (in class method).
     *
     * @return {boolean}
     */
    get isFieldDeclaration() {
        return this._expression instanceof AssignmentExpression &&
            this._expression.left instanceof MemberExpression &&
            this._expression.left.isObjectThis;
    }

    /**
     * Gets the field declaration name.
     *
     * @return {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
     */
    get fieldDeclarationExpression() {
        if (! this.isFieldDeclaration) {
            return null;
        }

        return this._expression.left.property;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler.compileNode(this._expression);
    }
}

module.exports = ExpressionStatement;
