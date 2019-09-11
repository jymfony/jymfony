const NodeInterface = require('./NodeInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class CatchClause extends implementationOf(NodeInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {null|Jymfony.Component.Autoloader.Parser.AST.PatternInterface} param
     * @param {Jymfony.Component.Autoloader.Parser.AST.BlockStatement} block
     */
    __construct(location, param, block) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.PatternInterface}
         *
         * @private
         */
        this._param = param;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.BlockStatement}
         *
         * @private
         */
        this._block = block;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('catch (');
        if (null !== this._param) {
            compiler.compileNode(this._param);
        } else {
            compiler._emit('Ξ_');
        }
        compiler._emit(')');

        compiler.compileNode(this._block);
    }
}

module.exports = CatchClause;
