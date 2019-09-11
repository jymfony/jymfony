declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class ArrowFunctionExpression extends Function {
        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
