declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class NewExpression extends CallExpression {
        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
