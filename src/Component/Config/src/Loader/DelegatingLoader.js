const FileLoaderLoadException = Jymfony.Component.Config.Exception.FileLoaderLoadException;
const Loader = Jymfony.Component.Config.Loader.Loader;

/**
 * DelegatingLoader delegates loading to other loaders using a loader resolver.
 *
 * This loader acts as an array of LoaderInterface objects - each having
 * a chance to load a given resource (handled by the resolver)
 *
 * @memberOf Jymfony.Component.Config.Loader
 */
class DelegatingLoader extends Loader {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Config.Loader.LoaderResolverInterface} resolver A LoaderResolverInterface instance
     */
    __construct(resolver) {
        this._resolver = resolver;
    }

    /**
     * @inheritdoc
     */
    load(resource, type = undefined) {
        let loader;
        if (false === (loader = this._resolver.resolve(resource, type))) {
            throw new FileLoaderLoadException(resource, undefined, null, undefined, type);
        }

        return loader.load(resource, type);
    }

    /**
     * @inheritdoc
     */
    supports(resource, type = undefined) {
        return false !== this._resolver.resolve(resource, type);
    }
}

module.exports = DelegatingLoader;
