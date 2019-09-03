declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class ClassProperty extends implementationOf(ClassMemberInterface) {
        public location: SourceLocation;
        public docblock: string | null;
        public decorators: null | AppliedDecorator[];

        private _key: ExpressionInterface;
        private _value: ExpressionInterface;
        private _static: boolean;

        /**
         * Gets the key.
         */
        public readonly key: ExpressionInterface;

        /**
         * Whether this method is static.
         */
        public readonly static: boolean;

        /**
         * Gets the initialization value.
         */
        public readonly value: ExpressionInterface;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, key: ExpressionInterface, value: ExpressionInterface, Static: boolean): void;
        constructor(location: SourceLocation, key: ExpressionInterface, value: ExpressionInterface, Static: boolean);

        /**
         * Clears out the initialization value.
         */
        clearValue(): void;

        /**
         * @inheritdoc
         */
        compileDecorators(compiler: Compiler, target: Class, id: Identifier): StatementInterface[];

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
