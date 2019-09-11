declare namespace Jymfony.Component.Autoloader.Parser {
    import Generator = Jymfony.Component.Autoloader.Parser.SourceMap.Generator;
    import SourceLocation = Jymfony.Component.Autoloader.Parser.AST.SourceLocation;
    import NodeInterface = Jymfony.Component.Autoloader.Parser.AST.NodeInterface;
    import Program = Jymfony.Component.Autoloader.Parser.AST.Program;

    export class Compiler {
        public readonly code: string;

        private _code: string;
        private _locations: SourceLocation[];
        private _sourceMapGenerator: Generator;
        private _line: number;
        private _column: number;
        private _variableCount: number;

        /**
         * Constructor.
         */
        constructor(sourceMapGenerator: Generator);

        /**
         * Compiles a source node.
         */
        compileNode(node: NodeInterface): void;

        /**
         * Sets the original source location.
         */
        pushLocation(node: NodeInterface): void;

        /**
         * Pops out the latest source location.
         */
        popLocation(): void;

        /**
         * @param {Jymfony.Component.Autoloader.Parser.AST.Program} program
         */
        compile(program: Program): string;

        /**
         * Emits a code string.
         *
         * @param {string} code
         */
        _emit(code: string);

        /**
         * @internal
         */
        generateVariableName(): string;
    }
}
