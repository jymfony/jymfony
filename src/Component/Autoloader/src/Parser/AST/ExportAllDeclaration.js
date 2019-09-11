const ModuleDeclarationInterface = require('./ModuleDeclarationInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ExportAllDeclaration extends implementationOf(ModuleDeclarationInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.Literal} source
     */
    __construct(location, source) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.Literal}
         *
         * @private
         */
        this._source = source;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('module.exports = exports = { ...exports, ...require(');
        compiler.compileNode(this._source);
        compiler._emit(') };\n');
    }
}

module.exports = ExportAllDeclaration;
