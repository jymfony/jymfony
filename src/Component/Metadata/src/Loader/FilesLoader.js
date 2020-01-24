const ChainLoader = Jymfony.Component.Metadata.Loader.ChainLoader;

export default class FilesLoader extends ChainLoader {
    /**
     * Constructor.
     *
     * @param {string[]} paths
     * @param {Newable<Jymfony.Component.Metadata.Loader.FileLoader>|string} loaderClass
     */
    __construct(paths, loaderClass = null) {
        try {
            loaderClass = ReflectionClass.getClass(loaderClass);
        } catch (e) {
            loaderClass = null;
        }

        /**
         * @type {Newable<Jymfony.Component.Metadata.Loader.FileLoader>}
         *
         * @private
         */
        this._loaderClass = loaderClass;

        const loaders = [];
        for (const path of paths) {
            loaders.push(this._getLoader(path));
        }

        super.__construct(loaders);
    }

    /**
     * Create an instance of LoaderInterface for the path.
     *
     * @param {string} path
     *
     * @returns {Jymfony.Component.Metadata.Loader.LoaderInterface}
     *
     * @protected
     */
    _getLoader(path) {
        if (! this._loaderClass) {
            throw new RuntimeException('You must implement _getLoader or pass the loader class to the constructor');
        }

        return new (this._loaderClass)(path);
    }
}
