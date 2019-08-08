const StatementInterface = require('./StatementInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class SwitchStatement extends implementationOf(StatementInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} discriminant
     * @param {Jymfony.Component.Autoloader.Parser.AST.SwitchCase[]} cases
     */
    __construct(location, discriminant, cases) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
         *
         * @private
         */
        this._discriminant = discriminant;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SwitchCase[]}
         *
         * @private
         */
        this._cases = cases;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('switch (');
        compiler.compileNode(this._discriminant);
        compiler._emit(') {\n');

        for (const c of this._cases) {
            compiler.compileNode(c);
            compiler._emit('\n');
        }

        compiler._emit('}');
    }
}

module.exports = SwitchStatement;
