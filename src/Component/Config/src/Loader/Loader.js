const FileLoaderLoadException = Jymfony.Component.Config.Exception.FileLoaderLoadException;
const LoaderInterface = Jymfony.Component.Config.Loader.LoaderInterface;

/**
 * Loader is the abstract class used by all built-in loaders.
 *
 * @memberOf Jymfony.Component.Config.Loader
 *
 * @abstract
 */
export default class Loader extends implementationOf(LoaderInterface) {
    /**
     * Constructor.
     *
     * @param {string | null} [env = null]
     */
    __construct(env = null) {
        /**
         * @type {undefined}
         *
         * @protected
         */
        this._resolver = undefined;

        /**
         * @type {string | null}
         *
         * @protected
         */
        this._env = env;
    }

    /**
     * @inheritdoc
     */
    get resolver() {
        return this._resolver;
    }

    /**
     * @inheritdoc
     */
    set resolver(resolver) {
        this._resolver = resolver;
    }

    /**
     * Imports a resource.
     *
     * @param {*} resource
     * @param {null|string} type
     *
     * @returns {*}
     */
    importResource(resource, type = null) {
        return this.resolve(resource, type).load(resource, type);
    }

    /**
     * Finds a loader able to load an imported resource.
     *
     * @param {*} resource
     * @param {null|string} type
     *
     * @returns {Jymfony.Component.Config.Loader.LoaderInterface}
     *
     * @throws {Jymfony.Component.Config.Exception.FileLoaderLoadException}
     */
    resolve(resource, type = null) {
        if (this.supports(resource, type)) {
            return this;
        }

        const loader = undefined === this._resolver ? false : this._resolver.resolve(resource, type);

        if (false === loader) {
            throw new FileLoaderLoadException(resource, undefined, undefined, undefined, type);
        }

        return loader;
    }
}
