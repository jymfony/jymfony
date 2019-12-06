const Class = require('./Class');
const DeclarationInterface = require('./DeclarationInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ClassDeclaration extends mix(Class, DeclarationInterface) {
    compile(compiler) {
        this.compileDecorators(compiler);
        super.compile(compiler);
        this.compileDocblock(compiler, this.id);
    }
}

module.exports = ClassDeclaration;
