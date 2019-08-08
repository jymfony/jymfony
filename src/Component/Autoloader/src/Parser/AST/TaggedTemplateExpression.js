const ExpressionInterface = require('./ExpressionInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class TaggedTemplateExpression extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} tag
     * @param {Jymfony.Component.Autoloader.Parser.AST.StringLiteral} template
     */
    __construct(location, tag, template) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
         *
         * @private
         */
        this._tag = tag;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.StringLiteral}
         *
         * @private
         */
        this._template = template;
    }

    /**
     * Gets the tag expression.
     *
     * @return {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
     */
    get tag() {
        return this._tag;
    }

    /**
     * Gets the template string.
     *
     * @return {Jymfony.Component.Autoloader.Parser.AST.StringLiteral}
     */
    get template() {
        return this._template;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler.compileNode(this._tag);
        compiler.compileNode(this._template);
    }
}

module.exports = TaggedTemplateExpression;
