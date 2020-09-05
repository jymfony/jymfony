const LoaderChain = Jymfony.Component.Validator.Mapping.Loader.LoaderChain;

/**
 * Base loader for loading validation metadata from a list of files.
 *
 * @see JsonFilesLoader
 * @see YamlFilesLoader
 *
 * @abstract
 *
 * @memberOf Jymfony.Component.Validator.Mapping.Loader
 */
export default class FilesLoader extends LoaderChain {
    /**
     * Creates a new loader.
     *
     * @param {string[]} paths An array of file paths
     */
    __construct(paths) {
        super.__construct(this._getFileLoaders(paths));
    }

    /**
     * Returns an array of file loaders for the given file paths.
     *
     * @param {string[]} paths An array of file paths
     *
     * @returns {Jymfony.Component.Metadata.Loader.LoaderInterface[]} The metadata loaders
     */
    _getFileLoaders(paths) {
        return paths.map(this._getFileLoaderInstance.bind(this));
    }

    /**
     * Creates a loader for the given file path.
     *
     * @param {string} path File path
     *
     * @returns {Jymfony.Component.Metadata.Loader.LoaderInterface} The created loader
     *
     * @protected
     * @abstract
     */
    _getFileLoaderInstance(path) { // eslint-disable-line no-unused-vars
        throw new Error('FilesLoader._getFileLoaderInstance must be implemented');
    }
}
