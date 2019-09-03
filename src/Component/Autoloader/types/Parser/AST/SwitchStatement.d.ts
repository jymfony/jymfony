declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class SwitchStatement extends implementationOf(StatementInterface) {
        public location: SourceLocation;

        private _discriminant: ExpressionInterface;
        private _cases: SwitchCase[];

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, discriminant: ExpressionInterface, cases: SwitchCase[]): void;
        constructor(location: SourceLocation, discriminant: ExpressionInterface, cases: SwitchCase[]);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
