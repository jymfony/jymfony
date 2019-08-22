const ExpressionInterface = require('./ExpressionInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ArrayExpression extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {(Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface|Jymfony.Component.Autoloader.Parser.AST.SpreadElement)[]} elements
     */
    __construct(location, elements) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {(Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface|Jymfony.Component.Autoloader.Parser.AST.SpreadElement)[]}
         *
         * @private
         */
        this._elements = isArray(elements) ? elements : [ elements ];
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('[ ');

        for (const element of this._elements) {
            if (null !== element) {
                compiler.compileNode(element);
            }

            compiler._emit(', ');
        }

        compiler._emit(' ]');
    }
}

module.exports = ArrayExpression;
