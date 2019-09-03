declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class ConditionalExpression extends implementationOf(ExpressionInterface) {
        public location: SourceLocation;
        private _test: ExpressionInterface;
        private _consequent: ExpressionInterface;
        private _alternate: ExpressionInterface;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, test: ExpressionInterface, consequent: ExpressionInterface, alternate: ExpressionInterface): void;
        constructor(location: SourceLocation, test: ExpressionInterface, consequent: ExpressionInterface, alternate: ExpressionInterface);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
