declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class FunctionStatement extends mix(Function, StatementInterface) {
        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
