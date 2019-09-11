const Docblock = require('./Docblock');
const StatementInterface = require('./StatementInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class BlockStatement extends implementationOf(StatementInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.StatementInterface[]} body
     */
    __construct(location, body) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.StatementInterface[]}
         *
         * @private
         */
        this._body = body;
    }

    /**
     * Gets the block statements array.
     *
     * @return {Jymfony.Component.Autoloader.Parser.AST.StatementInterface[]}
     */
    get statements() {
        return this._body;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('{\n');
        for (const statement of this._body) {
            if (statement instanceof Docblock) {
                continue;
            }

            compiler.compileNode(statement);
            compiler._emit(';\n');
        }
        compiler._emit('}\n');
    }
}

module.exports = BlockStatement;
