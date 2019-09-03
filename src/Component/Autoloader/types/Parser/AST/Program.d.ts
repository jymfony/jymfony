declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class Program extends implementationOf(NodeInterface) {
        public location: SourceLocation;
        public esModule: boolean;

        /**
         * Gets the nodes array.
         */
        public readonly body: NodeInterface[];

        private _body: NodeInterface[];
        private _prepared: boolean;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation): void;
        constructor(location: SourceLocation);

        /**
         * Adds a node.
         */
        add(node: NodeInterface): void;

        /**
         * Prepares the program body.
         */
        prepare(): void;

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
