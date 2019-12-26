declare namespace Jymfony.Component.Metadata.Loader {
    export abstract class FileLoader extends implementationOf(LoaderInterface) {
        private _filePath: string;

        /**
         * FileLoader constructor.
         */
        __construct(filePath: string): void;
        constructor(filePath: string);

        /**
         * @inheritdoc
         */
        loadClassMetadata(classMetadata: ClassMetadataInterface): boolean;

        /**
         * Load class metadata from file content.
         */
        protected abstract _loadClassMetadataFromFile(file_content: string, classMetadata: ClassMetadataInterface): boolean;
    }
}
