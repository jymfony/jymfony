declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class SequenceExpression extends implementationOf(ExpressionInterface) {
        public location: SourceLocation;
        private _expressions: ExpressionInterface[];

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, expressions: ExpressionInterface[]): void;
        constructor(location: SourceLocation, expressions: ExpressionInterface[]);

        /**
         * Gets the expressions.
         */
        public readonly expressions: ExpressionInterface[];

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
