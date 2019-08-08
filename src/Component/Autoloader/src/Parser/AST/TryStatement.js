const StatementInterface = require('./StatementInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class TryStatement extends implementationOf(StatementInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.BlockStatement} block
     * @param {Jymfony.Component.Autoloader.Parser.AST.CatchClause} handler
     * @param {Jymfony.Component.Autoloader.Parser.AST.BlockStatement} finalizer
     */
    __construct(location, block, handler, finalizer) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.BlockStatement}
         *
         * @private
         */
        this._block = block;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.CatchClause}
         *
         * @private
         */
        this._handler = handler;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.BlockStatement}
         *
         * @private
         */
        this._finalizer = finalizer;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('try');
        compiler.compileNode(this._block);

        if (null !== this._handler) {
            compiler.compileNode(this._handler);
        }

        if (null !== this._finalizer) {
            compiler._emit('finally');
            compiler.compileNode(this._finalizer);
        }
    }
}

module.exports = TryStatement;
