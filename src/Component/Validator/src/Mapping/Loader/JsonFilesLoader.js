const FilesLoader = Jymfony.Component.Validator.Mapping.Loader.FilesLoader;
const JsonFileLoader = Jymfony.Component.Validator.Mapping.Loader.JsonFileLoader;

/**
 * Loads validation metadata from a list of JSON files.
 *
 * @see FilesLoader
 *
 * @memberOf Jymfony.Component.Validator.Mapping.Loader
 */
export default class JsonFilesLoader extends FilesLoader {
    /**
     * @inheritdoc
     */
    _getFileLoaderInstance(file) {
        return new JsonFileLoader(file);
    }
}
