declare namespace Jymfony.Component.Validator.Mapping.Loader {
    import LoaderInterface = Jymfony.Component.Metadata.Loader.LoaderInterface;

    /**
     * Loads validation metadata from a list of YAML files.
     *
     * @see FilesLoader
     */
    export class YamlFilesLoader extends FilesLoader {
        /**
         * @inheritdoc
         */
        protected _getFileLoaderInstance(file: string): LoaderInterface;
    }
}
