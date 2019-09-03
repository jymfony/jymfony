declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class ForStatement extends implementationOf(StatementInterface) {
        public location: SourceLocation;

        private _init: null | VariableDeclaration | ExpressionInterface;
        private _test: ExpressionInterface;
        private _update: ExpressionInterface;
        private _body: StatementInterface;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, init: null | VariableDeclaration | ExpressionInterface, test: ExpressionInterface, update: ExpressionInterface, body: StatementInterface): void;
        constructor(location: SourceLocation, init: null | VariableDeclaration | ExpressionInterface, test: ExpressionInterface, update: ExpressionInterface, body: StatementInterface);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
