const FilesLoader = Jymfony.Component.Validator.Mapping.Loader.FilesLoader;
const YamlFileLoader = Jymfony.Component.Validator.Mapping.Loader.YamlFileLoader;

/**
 * Loads validation metadata from a list of YAML files.
 *
 * @see FilesLoader
 *
 * @memberOf Jymfony.Component.Validator.Mapping.Loader
 */
export default class YamlFilesLoader extends FilesLoader {
    /**
     * @inheritdoc
     */
    _getFileLoaderInstance(file) {
        return new YamlFileLoader(file);
    }
}
