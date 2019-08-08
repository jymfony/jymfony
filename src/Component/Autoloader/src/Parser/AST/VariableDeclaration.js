const DeclarationInterface = require('./DeclarationInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class VariableDeclaration extends implementationOf(DeclarationInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {"const"|"let"|"var"} kind
     * @param {Jymfony.Component.Autoloader.Parser.AST.VariableDeclarator[]} declarators
     */
    __construct(location, kind, declarators) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {"const"|"let"|"var"}
         *
         * @private
         */
        this._kind = kind;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.VariableDeclarator[]}
         *
         * @private
         */
        this._declarators = declarators;

        /**
         * @type {null|string}
         */
        this.docblock = null;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit(this._kind + ' ');

        for (const i in this._declarators) {
            compiler.compileNode(this._declarators[i]);

            if (i != this._declarators.length - 1) {
                compiler._emit(', ');
            }
        }
    }
}

module.exports = VariableDeclaration;
