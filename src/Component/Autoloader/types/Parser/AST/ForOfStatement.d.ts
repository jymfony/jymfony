declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class ForOfStatement extends ForInStatement {
        private _await: boolean;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(location: SourceLocation, left: VariableDeclaration | ExpressionInterface, right: ExpressionInterface, body: StatementInterface, _await: boolean): void;
        constructor(location: SourceLocation, left: VariableDeclaration | ExpressionInterface, right: ExpressionInterface, body: StatementInterface, _await: boolean);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
