declare namespace Jymfony.Component.Validator.Mapping.Loader {
    import AbstractLoader = Jymfony.Component.Validator.Mapping.Loader.AbstractLoader;

    /**
     * Base loader for loading validation metadata from a file.
     */
    export abstract class FileLoader extends AbstractLoader {
        /**
         * Creates a new loader.
         *
         * @param file The mapping file to load
         *
         * @throws {Jymfony.Component.Validator.Exception.MappingException} If the file does not exist or is not readable
         */
        // @ts-ignore
        __construct(file: string): void;
        constructor(file: string);
    }
}
