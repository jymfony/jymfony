const ExpressionInterface = require('./ExpressionInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class SequenceExpression extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface[]} expressions
     */
    __construct(location, expressions) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface[]}
         *
         * @private
         */
        this._expressions = expressions;
    }

    /**
     * Gets the expressions.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface[]}
     */
    get expressions() {
        return this._expressions;
    }
    /**
     * @inheritdoc
     */
    compile(compiler) {
        for (const i in this._expressions) {
            compiler.compileNode(this._expressions[i]);

            if (i != this._expressions.length - 1) {
                compiler._emit(', ');
            }
        }
    }
}

module.exports = SequenceExpression;
