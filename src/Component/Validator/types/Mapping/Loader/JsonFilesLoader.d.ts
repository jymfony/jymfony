declare namespace Jymfony.Component.Validator.Mapping.Loader {
    import LoaderInterface = Jymfony.Component.Metadata.Loader.LoaderInterface;

    /**
     * Loads validation metadata from a list of JSON files.
     *
     * @see FilesLoader
     */
    export class JsonFilesLoader extends FilesLoader {
        /**
         * @inheritdoc
         */
        protected _getFileLoaderInstance(file: string): LoaderInterface;
    }
}
