const StatementInterface = require('./StatementInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ReturnStatement extends implementationOf(StatementInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {null|Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} argument
     */
    __construct(location, argument = null) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

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
        compiler._emit('return');
        if (null !== this._argument) {
            compiler._emit(' ');
            compiler.compileNode(this._argument);
        }
    }
}

module.exports = ReturnStatement;
