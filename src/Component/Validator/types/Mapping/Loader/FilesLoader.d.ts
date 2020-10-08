declare namespace Jymfony.Component.Validator.Mapping.Loader {
    import LoaderChain = Jymfony.Component.Validator.Mapping.Loader.LoaderChain;
    import LoaderInterface = Jymfony.Component.Metadata.Loader.LoaderInterface;

    /**
     * Base loader for loading validation metadata from a list of files.
     *
     * @see JsonFilesLoader
     * @see YamlFilesLoader
     */
    export abstract class FilesLoader extends LoaderChain {
        /**
         * Creates a new loader.
         *
         * @param paths An array of file paths
         */
        // @ts-ignore
        __construct(paths: string[]): void;
        constructor(paths: string[]);

        /**
         * Creates a loader for the given file path.
         *
         * @param path File path
         *
         * @returns The created loader
         */
        protected abstract _getFileLoaderInstance(path: string): LoaderInterface;

        /**
         * Returns an array of file loaders for the given file paths.
         *
         * @param paths An array of file paths
         *
         * @returns The metadata loaders
         */
        private _getFileLoaders(paths: string[]): LoaderInterface[];
    }
}
