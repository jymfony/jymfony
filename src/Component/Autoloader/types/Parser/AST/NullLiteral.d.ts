declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class NullLiteral extends Literal {
        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
