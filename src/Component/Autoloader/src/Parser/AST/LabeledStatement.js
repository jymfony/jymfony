const StatementInterface = require('./StatementInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class LabeledStatement extends implementationOf(StatementInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.Identifier} label
     * @param {Jymfony.Component.Autoloader.Parser.AST.StatementInterface} statement
     */
    __construct(location, label, statement) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.Identifier}
         *
         * @private
         */
        this._label = label;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.StatementInterface}
         *
         * @private
         */
        this._statement = statement;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler.compileNode(this._label);
        compiler._emit(': ');
        compiler.compileNode(this._statement);
    }
}

module.exports = LabeledStatement;
