declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class ImportSpecifier extends implementationOf(ImportSpecifierInterface) {
        public location: SourceLocation;

        private _local: Identifier;
        private _imported: Identifier;

        /**
         * Gets the local part.
         */
        public readonly local: Identifier;

        /**
         * Gets the imported part.
         */
        public readonly imported: Identifier;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, local: Identifier, imported: Identifier): void;
        constructor(location: SourceLocation, local: Identifier, imported: Identifier);
    }
}
