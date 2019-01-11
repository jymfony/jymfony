const ConfiguratorInterface = Jymfony.Component.Routing.Loader.Configurator.ConfiguratorInterface;
const Traits = Jymfony.Component.Routing.Loader.Configurator.Traits;

/**
 * @memberOf Jymfony.Component.Routing.Loader.Configurator
 */
class RouteConfigurator extends implementationOf(
    ConfiguratorInterface,
    Traits.AddTrait, Traits.RouteTrait
) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Routing.RouteCollection} collection
     * @param {Jymfony.Component.Routing.RouteCollection|Jymfony.Component.Routing.Route} route
     * @param {string} [name = '']
     * @param {Jymfony.Component.Routing.Loader.Configurator.CollectionConfigurator} [parentConfigurator]
     * @param {Object} [prefixes]
     */
    __construct(collection, route, name = '', parentConfigurator = undefined, prefixes = undefined) {
        /**
         * @type {Jymfony.Component.Routing.RouteCollection}
         *
         * @private
         */
        this._collection = collection;

        /**
         * @type {Jymfony.Component.Routing.RouteCollection|Jymfony.Component.Routing.Route}
         *
         * @private
         */
        this._route = route;

        /**
         * @type {string}
         *
         * @private
         */
        this._name = name;

        /**
         *
         * @type {Jymfony.Component.Routing.Loader.Configurator.CollectionConfigurator}
         *
         * @private
         */
        this._parentConfigurator = parentConfigurator;

        /**
         * @type {Object}
         *
         * @private
         */
        this._prefixes = prefixes;
    }

    /**
     * Builds a route (or route collection).
     *
     * @returns {Jymfony.Component.Routing.RouteCollection|Jymfony.Component.Routing.Route}
     */
    build() {
        return this._route;
    }
}

module.exports = RouteConfigurator;
