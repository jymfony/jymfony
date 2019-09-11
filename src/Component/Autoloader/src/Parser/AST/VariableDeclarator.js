const NodeInterface = require('./NodeInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class VariableDeclarator extends implementationOf(NodeInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.PatternInterface} id
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} init
     */
    __construct(location, id, init = null) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.PatternInterface}
         *
         * @private
         */
        this._id = id;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
         *
         * @private
         */
        this._init = init;
    }

    /**
     * Gets the id.
     *
     * @return {Jymfony.Component.Autoloader.Parser.AST.PatternInterface}
     */
    get id() {
        return this._id;
    }

    /**
     * Gets the init value.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
     */
    get init() {
        return this._init;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler.compileNode(this._id);

        if (null !== this._init) {
            compiler._emit(' = ');
            compiler.compileNode(this._init);
        }
    }
}

module.exports = VariableDeclarator;
