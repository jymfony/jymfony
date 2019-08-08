const StatementInterface = require('./StatementInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ContinueStatement extends implementationOf(StatementInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {null|Jymfony.Component.Autoloader.Parser.AST.Identifier} label
     */
    __construct(location, label) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {null|Jymfony.Component.Autoloader.Parser.AST.Identifier}
         *
         * @private
         */
        this._label = label;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('continue');

        if (null !== this._label) {
            compiler._emit(' ');
            compiler.compileNode(this._label);
        }
    }
}

module.exports = ContinueStatement;
