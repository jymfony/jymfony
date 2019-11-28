declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class CallExpression extends implementationOf(ExpressionInterface) {
        public location: SourceLocation;
        private _callee: ExpressionInterface;
        private _args: (ExpressionInterface | SpreadElement)[];
        private _optional: boolean;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, callee: ExpressionInterface, args: (ExpressionInterface | SpreadElement)[], optional?: boolean): void;
        constructor(location: SourceLocation, callee: ExpressionInterface, args: (ExpressionInterface | SpreadElement)[], optional?: boolean);

        /**
         * Gets the callee expression.
         */
        public readonly callee: ExpressionInterface;

        /**
         * Gets the arguments.
         */
        public readonly args: (ExpressionInterface | SpreadElement)[];

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
