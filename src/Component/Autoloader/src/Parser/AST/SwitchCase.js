const NodeInterface = require('./NodeInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class SwitchCase extends implementationOf(NodeInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {null|Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} test
     * @param {Jymfony.Component.Autoloader.Parser.AST.StatementInterface[]} consequent
     */
    __construct(location, test, consequent) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {null|Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
         *
         * @private
         */
        this._test = test;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.StatementInterface[]}
         *
         * @private
         */
        this._consequent = consequent;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        if (null === this._test) {
            compiler._emit('default');
        } else {
            compiler._emit('case ');
            compiler.compileNode(this._test);
        }

        compiler._emit(':\n');
        for (const consequent of this._consequent) {
            compiler.compileNode(consequent);
            compiler._emit(';\n');
        }
    }
}

module.exports = SwitchCase;
