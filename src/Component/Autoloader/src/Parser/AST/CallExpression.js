const ExpressionInterface = require('./ExpressionInterface');
const Function = require('./Function');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class CallExpression extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} callee
     * @param {(Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface|Jymfony.Component.Autoloader.Parser.AST.SpreadElement)[]} args
     * @param {boolean} [optional = false]
     */
    __construct(location, callee, args, optional = false) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
         *
         * @private
         */
        this._callee = callee;

        /**
         * @type {(Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface|Jymfony.Component.Autoloader.Parser.AST.SpreadElement)[]}
         *
         * @private
         */
        this._args = args;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._optional = optional;
    }

    /**
     * Gets the callee expression.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
     */
    get callee() {
        return this._callee;
    }

    /**
     * Gets the arguments.
     *
     * @returns {(Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface|Jymfony.Component.Autoloader.Parser.AST.SpreadElement)[]}
     */
    get args() {
        return this._args;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler.compileNode(this._callee);
        if (this._optional) {
            compiler._emit('?.');
        }

        Function.compileParams(compiler, this._args);
    }
}

module.exports = CallExpression;
