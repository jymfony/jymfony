declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class TaggedTemplateExpression extends implementationOf(ExpressionInterface) {
        public location: SourceLocation;

        private _tag: ExpressionInterface;
        private _template: StringLiteral;

        /**
         * Gets the tag expression.
         */
        public readonly tag: ExpressionInterface;

        /**
         * Gets the template string.
         */
        public readonly template: StringLiteral;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, tag: ExpressionInterface, template: StringLiteral): void;
        constructor(location: SourceLocation, tag: ExpressionInterface, template: StringLiteral);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
