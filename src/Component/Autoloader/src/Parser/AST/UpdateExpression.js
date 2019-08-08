const ExpressionInterface = require('./ExpressionInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class UpdateExpression extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {string} operator
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} argument
     * @param {boolean} prefix
     */
    __construct(location, operator, argument, prefix) {
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

        /**
         * @type {boolean}
         *
         * @private
         */
        this._prefix = prefix;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        if (this._prefix) {
            compiler._emit(this._operator);
        }

        compiler.compileNode(this._argument);

        if (! this._prefix) {
            compiler._emit(this._operator);
        }
    }
}

module.exports = UpdateExpression;
