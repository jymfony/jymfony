declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class FunctionExpression extends mix(Function, ExpressionInterface) {
        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
