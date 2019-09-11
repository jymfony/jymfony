const ConditionalExpression = require('./ConditionalExpression');
const Identifier = require('./Identifier');
const ImportDefaultSpecifier = require('./ImportDefaultSpecifier');
const ImportNamespaceSpecifier = require('./ImportNamespaceSpecifier');
const ImportSpecifier = require('./ImportSpecifier');
const MemberExpression = require('./MemberExpression');
const ModuleDeclarationInterface = require('./ModuleDeclarationInterface');
const VariableDeclaration = require('./VariableDeclaration');
const VariableDeclarator = require('./VariableDeclarator');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ImportDeclaration extends implementationOf(ModuleDeclarationInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.ImportSpecifierInterface[]} specifiers
     * @param {Jymfony.Component.Autoloader.Parser.AST.Literal} source
     */
    __construct(location, specifiers, source) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ImportSpecifierInterface[]}
         *
         * @private
         */
        this._specifiers = specifiers;

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
        const variableName = compiler.generateVariableName();
        compiler._emit('const ' + variableName + ' = require(');
        compiler.compileNode(this._source);
        compiler._emit(');\n');

        for (const specifier of this._specifiers) {
            let right;

            if (specifier instanceof ImportDefaultSpecifier) {
                right = new ConditionalExpression(null,
                    new MemberExpression(null, new Identifier(null, variableName), new Identifier(null, '__esModule')),
                    new MemberExpression(null, new Identifier(null, variableName), new Identifier(null, 'default')),
                    new Identifier(null, variableName)
                );
            } else if (specifier instanceof ImportNamespaceSpecifier) {
                right = new Identifier(null, variableName);
            } else if (specifier instanceof ImportSpecifier) {
                const imported = specifier.imported.isDecoratorIdentifier ? new Identifier(null, '__δdecorators__' + specifier.imported.name.substr(1)) : specifier.imported;
                right = new MemberExpression(null, new Identifier(null, variableName), imported);
            }

            const local = specifier.local.isDecoratorIdentifier ? new Identifier(null, '__δdecorators__' + specifier.local.name.substr(1)) : specifier.local;
            compiler.compileNode(new VariableDeclaration(null, 'const', [
                new VariableDeclarator(null, local, right),
            ]));
            compiler._emit(';\n');
        }
    }
}

module.exports = ImportDeclaration;
