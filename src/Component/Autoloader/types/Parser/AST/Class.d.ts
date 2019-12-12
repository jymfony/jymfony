declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export abstract class Class extends implementationOf(NodeInterface) {
        public location: SourceLocation;
        public docblock: null | string;
        public decorators: null | AppliedDecorator[];

        private _body: ClassBody;
        private _id: Identifier;
        private _superClass: ExpressionInterface | null;

        /**
         * Gets the class name.
         */
        public readonly name: string;

        /**
         * Gets the class identifier.
         */
        public readonly id: Identifier;

        /**
         * Gets the class body.
         */
        public readonly body: ClassBody;

        /**
         * Gets/sets the superclass.
         */
        public superClass: null | ExpressionInterface;

        /**
         * Class has constructor.
         */
        public readonly hasConstructor: boolean;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, body: ClassBody, id?: Identifier | null, superClass?: ExpressionInterface | null): void;
        constructor(location: SourceLocation, body: ClassBody, id?: Identifier | null, superClass?: ExpressionInterface | null);

        /**
         * Class has constructor.
         */
        getConstructor(): null | ClassMethod;

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler);

        /**
         * Compiles the docblock registration code.
         */
        compileDocblock(compiler: Compiler, id: Identifier): void;

        /**
         * Compiles the decorators upon this class.
         */
        compileDecorators(compiler: Compiler): StatementInterface[];

        private _prepare(): void;
    }
}
