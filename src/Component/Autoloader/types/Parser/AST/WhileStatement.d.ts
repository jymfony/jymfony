declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class WhileStatement extends implementationOf(StatementInterface) {
        public location: SourceLocation;

        private _test: ExpressionInterface;
        private _body: StatementInterface;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, test: ExpressionInterface, body: StatementInterface): void;
        constructor(location: SourceLocation, test: ExpressionInterface, body: StatementInterface);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
