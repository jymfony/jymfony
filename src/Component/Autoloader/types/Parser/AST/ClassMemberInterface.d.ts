declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class ClassMemberInterface extends NodeInterface.definition implements MixinInterface {
        public static readonly definition: Newable<ClassMemberInterface>;

        /**
         * Compiles the decorators.
         * Code to be appended should be returned as an array of statements.
         */
        compileDecorators(compiler: Compiler, target: Class, id: Identifier): StatementInterface[];
    }
}
