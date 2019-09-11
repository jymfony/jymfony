declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class IfStatement extends implementationOf(StatementInterface) {
        public location: SourceLocation;
        private _test: ExpressionInterface;
        private _consequent: StatementInterface;
        private _alternate: null | StatementInterface;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, test: ExpressionInterface, consequent: StatementInterface, alternate?: null | StatementInterface): void;
        constructor(location: SourceLocation, test: ExpressionInterface, consequent: StatementInterface, alternate?: null | StatementInterface);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
