declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class ClassDeclaration extends mix(Class, DeclarationInterface) {
        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
