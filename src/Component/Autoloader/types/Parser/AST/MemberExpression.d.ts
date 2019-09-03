declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class MemberExpression extends implementationOf(ExpressionInterface) {
        public location: SourceLocation;

        private _object: ExpressionInterface;
        private _property: ExpressionInterface;
        private _computed: boolean;
        private _optional: boolean;

        /**
         * Gets the property accessed by this member access expression.
         */
        public readonly property: ExpressionInterface;

        /**
         * Whether the object of the member expression is "this"
         */
        public readonly isObjectThis: boolean;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, object: ExpressionInterface, property: ExpressionInterface, computed: boolean, optional?: boolean): void;
        constructor(location: SourceLocation, object: ExpressionInterface, property: ExpressionInterface, computed: boolean, optional?: boolean);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
