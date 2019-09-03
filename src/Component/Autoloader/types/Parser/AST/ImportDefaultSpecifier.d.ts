declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class ImportDefaultSpecifier extends implementationOf(ImportSpecifierInterface) {
        public location: SourceLocation;
        private _local: Identifier;

        /**
         * Gets the local part.
         */
        public readonly local: Identifier;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, local: Identifier): void;
        constructor(location: SourceLocation, local: Identifier);
    }
}
