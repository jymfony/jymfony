const CollectionConfigurator = Jymfony.Component.Routing.Loader.Configurator.CollectionConfigurator;
const ConfiguratorInterface = Jymfony.Component.Routing.Loader.Configurator.ConfiguratorInterface;
const ImportConfigurator = Jymfony.Component.Routing.Loader.Configurator.ImportConfigurator;
const ConfiguratorTrait = Jymfony.Component.Routing.Loader.Configurator.Traits.ConfiguratorTrait;
const RouteCollection = Jymfony.Component.Routing.RouteCollection;
const path = require('path');

/**
 * @memberOf Jymfony.Component.Routing.Loader.Configurator
 */
class RoutingConfigurator extends implementationOf(ConfiguratorInterface, ConfiguratorTrait) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Routing.RouteCollection} collection
     * @param {Jymfony.Component.Routing.Loader.JsFileLoader} loader
     * @param {string} path
     * @param {string} file
     */
    __construct(collection, loader, path, file) {
        /**
         * @type {Jymfony.Component.Routing.RouteCollection}
         *
         * @private
         */
        this._collection = collection;

        /**
         * @type {Jymfony.Component.Routing.Loader.JsFileLoader}
         *
         * @private
         */
        this._loader = loader;

        /**
         * @type {string}
         *
         * @private
         */
        this._path = path;

        /**
         * @type {string}
         *
         * @private
         */
        this._file = file;
    }

    /**
     * Imports a resource to this route collection.
     *
     * @param {*} resource
     * @param {string} [type]
     * @param {boolean} [ignoreErrors = false]
     *
     * @returns {Jymfony.Component.Routing.Loader.Configurator.ImportConfigurator}
     *
     * @final
     */
    import(resource, type = undefined, ignoreErrors = false) {
        this._loader.currentDir = path.dirname(this._path);
        const imported = this._loader.import(resource, type, ignoreErrors, this._file);
        if (! isArray(imported)) {
            return this._push(new ImportConfigurator(this._collection, imported));
        }

        const mergedCollection = new RouteCollection();
        for (const subCollection of imported) {
            mergedCollection.addCollection(subCollection);
        }

        return this._push(new ImportConfigurator(this._collection, mergedCollection));
    }

    /**
     * Adds a collection.
     *
     * @param {string} name
     *
     * @returns {Jymfony.Component.Routing.Loader.Configurator.CollectionConfigurator}
     *
     * @final
     */
    collection(name = '') {
        return this._push(new CollectionConfigurator(this._collection, name));
    }

    /**
     * Builds a route collection from children.
     *
     * @returns {Jymfony.Component.Routing.RouteCollection}
     */
    build() {
        this._children.forEach(configurator => configurator.build());

        return this._collection;
    }
}

module.exports = RoutingConfigurator;
