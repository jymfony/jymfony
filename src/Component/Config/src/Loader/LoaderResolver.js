const LoaderResolverInterface = Jymfony.Component.Config.Loader.LoaderResolverInterface;

/**
 * LoaderResolver selects a loader for a given resource.
 *
 * A resource can be anything (e.g. a full path to a config file or a Closure).
 * Each loader determines whether it can load a resource and how.
 *
 * @memberOf Jymfony.Component.Config.Loader
 */
export default class LoaderResolver extends implementationOf(LoaderResolverInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Config.Loader.LoaderInterface[]} [loaders = []] An array of loaders
     */
    __construct(loaders = []) {
        /**
         * @type {Jymfony.Component.Config.Loader.LoaderInterface[]}
         *
         * @private
         */
        this._loaders = [];

        for (const loader of loaders) {
            this.addLoader(loader);
        }
    }

    /**
     * @inheritdoc
     */
    resolve(resource, type = undefined) {
        for (const loader of this._loaders) {
            if (loader.supports(resource, type)) {
                return loader;
            }
        }

        return false;
    }

    /**
     * Adds a loader.
     *
     * @param {Jymfony.Component.Config.Loader.LoaderInterface} loader A LoaderInterface instance
     */
    addLoader(loader) {
        this._loaders.push(loader);
        loader.resolver = this;
    }

    /**
     * Returns the registered loaders.
     *
     * @returns {Jymfony.Component.Config.Loader.LoaderInterface[]} An array of LoaderInterface instances
     */
    get loaders() {
        return [ ...this._loaders ];
    }
}
