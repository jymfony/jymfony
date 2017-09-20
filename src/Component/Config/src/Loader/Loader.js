const FileLoaderLoadException = Jymfony.Component.Config.Exception.FileLoaderLoadException;
const LoaderInterface = Jymfony.Component.Config.Loader.LoaderInterface;

/**
 * Loader is the abstract class used by all built-in loaders.
 *
 * @memberOf Jymfony.Component.Config.Loader
 * @abstract
 */
class Loader extends implementationOf(LoaderInterface) {
    __construct() {
        /**
         * @type {undefined}
         * @protected
         */
        this._resolver = undefined;
    }

    /**
     * @inheritDoc
     */
    get resolver() {
        return this._resolver;
    }

    /**
     * @inheritDoc
     */
    set resolver(resolver) {
        this._resolver = resolver;
    }

    /**
     * Imports a resource.
     *
     * @param {*} resource
     * @param {undefined|string} type
     *
     * @returns {*}
     */
    importResource(resource, type = undefined) {
        return this.resolve(resource, type).load(resource, type);
    }

    /**
     * Finds a loader able to load an imported resource.
     *
     * @param {*} resource
     * @param {undefined|string} type
     *
     * @returns {Jymfony.Component.Config.Loader.LoaderInterface}
     *
     * @throws {Jymfony.Component.Config.Exception.FileLoaderLoadException}
     */
    resolve(resource, type = undefined) {
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

module.exports = Loader;
