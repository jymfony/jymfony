declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class ThrowStatement extends implementationOf(StatementInterface) {
        public location: SourceLocation;
        private _expression: ExpressionInterface;

        /**
         * Constructor.
         *
         * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
         * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} expression
         */
        __construct(location: SourceLocation, expression: ExpressionInterface): void;
        constructor(location: SourceLocation, expression: ExpressionInterface);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
