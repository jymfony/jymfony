const ExpressionInterface = require('./ExpressionInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class YieldExpression extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} argument
     * @param {boolean} delegate
     */
    __construct(location, argument, delegate) {
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

        /**
         * @type {boolean}
         *
         * @private
         */
        this._delegate = delegate;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('yield ');
        if (this._delegate) {
            compiler._emit('* ');
        }

        if (null !== this._argument) {
            compiler.compileNode(this._argument);
        }
    }
}

module.exports = YieldExpression;
