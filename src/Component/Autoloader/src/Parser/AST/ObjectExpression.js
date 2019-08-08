const ExpressionInterface = require('./ExpressionInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ObjectExpression extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.ObjectMember[]} properties
     */
    __construct(location, properties) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ObjectMember[]}
         *
         * @private
         */
        this._properties = properties;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('{\n');

        for (const property of this._properties) {
            compiler.compileNode(property);
            compiler._emit(',');
        }

        compiler._emit('}');
    }
}

module.exports = ObjectExpression;
