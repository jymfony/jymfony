declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class ArrayExpression extends implementationOf(ExpressionInterface) {
        public location: SourceLocation;
        private _elements: (ExpressionInterface | SpreadElement)[];

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, elements: (ExpressionInterface|SpreadElement)[]): void;
        constructor(location: SourceLocation, elements: (ExpressionInterface|SpreadElement)[]);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
