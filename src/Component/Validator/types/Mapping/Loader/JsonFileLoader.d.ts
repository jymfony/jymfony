declare namespace Jymfony.Component.Validator.Mapping.Loader {
    import FileLoader = Jymfony.Component.Validator.Mapping.Loader.FileLoader;
    import MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;

    /**
     * Loads validation metadata from a JSON file.
     */
    export class JsonFileLoader extends FileLoader {
        /**
         * An array of Json class descriptions.
         */
        protected _classes: null | Record<string, any>;

        __construct(file: string): void;
        constructor(file: string);

        /**
         * @inheritdoc
         */
        loadClassMetadata(metadata: MetadataInterface): void;

        /**
         * Return the names of the classes mapped in this file.
         *
         * @returns The classes names
         */
        getMappedClasses(): string[];

        /**
         * Parses a collection of YAML nodes.
         *
         * @param {Object.<string, *>} nodes The YAML nodes
         *
         * @returns {*[]|Object.<string, *>} An array of values or Constraint instances
         *
         * @protected
         */
        protected _parseNodes(nodes: Record<string, any>): any[] | Record<string, any>;

        /**
         * Loads the class descriptions from the given file.
         *
         * @throws {InvalidArgumentException} If the file could not be loaded or did not contain a YAML
         */
        protected _parseFile(): any;

        private _loadClasses(): void;
        private _loadClassMetadata(metadata: ClassMetadataInterface, classDescription: any): void;
    }
}
