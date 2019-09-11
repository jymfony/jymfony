declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class ExportSpecifier extends implementationOf(NodeInterface) {
        public location: SourceLocation;
        private _local: Identifier;
        private _exported: Identifier;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, local: Identifier, exported: Identifier): void;
        constructor(location: SourceLocation, local: Identifier, exported: Identifier);

        /**
         * Gets the local name.
         */
        public readonly local: Identifier;

        /**
         * Gets the exported name.
         */
        public readonly exported: Identifier;
    }
}
