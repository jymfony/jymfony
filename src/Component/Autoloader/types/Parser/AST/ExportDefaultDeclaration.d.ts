declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class ExportDefaultDeclaration extends implementationOf(ModuleDeclarationInterface) {
        public location: SourceLocation;
        public docblock: null | string;
        public decorators: null | AppliedDecorator[];
        private _expression: ExpressionInterface;

        /**
         * Gets the expression to be default exported.
         */
        public readonly expression: ExpressionInterface;

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
