declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class Function extends implementationOf(NodeInterface) {
        public location: SourceLocation;
        public docblock: null | string;

        private _body: BlockStatement;
        private _id: Identifier;
        private _params: Argument[];
        private _generator: boolean;
        private _async: boolean;

        /**
         * Gets the function identifier.
         */
        public readonly id: Identifier;

        /**
         * Gets the function name.
         */
        public readonly name: string;

        /**
         * Gets the function parameters.
         */
        public readonly params: Argument[];

        /**
         * Gets the function body (block statement).
         */
        public readonly body: BlockStatement;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, body: BlockStatement, id?: Identifier | null, params?: PatternInterface[], { generator, async }?: { generator?: boolean, async?: boolean }): void;
        constructor(location: SourceLocation, body: BlockStatement, id?: Identifier | null, params?: PatternInterface[], { generator, async }?: { generator?: boolean, async?: boolean });

        /**
         * Compiles the docblock registration code.
         */
        compileDocblock(compiler: Compiler, id: Identifier): void;

        /**
         * Compile parameter list of a function.
         */
        static compileParams(compiler: Compiler, params: PatternInterface[]): void;
    }
}
