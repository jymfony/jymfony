declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class ExpressionStatement extends implementationOf(StatementInterface) {
        public location: SourceLocation;
        public docblock: null | string;

        private _expression: ExpressionInterface;

        /**
         * Gets the expression of this statement.
         */
        public readonly expression: ExpressionInterface;

        /**
         * Whether this expression is a possible field declaration (in class method).
         */
        public readonly isFieldDeclaration: boolean;

        /**
         * Gets the field declaration name.
         */
        public readonly fieldDeclarationExpression: ExpressionInterface;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, expression: ExpressionInterface): void;
        constructor(location: SourceLocation, expression: ExpressionInterface);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
