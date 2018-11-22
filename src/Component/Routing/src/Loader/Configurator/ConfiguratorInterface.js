/**
 * @memberOf Jymfony.Component.Routing.Loader.Configurator
 */
class ConfiguratorInterface {
    /**
     * Builds a route collection from children.
     *
     * @returns {Jymfony.Component.Routing.RouteCollection}
     */
    build() { }
}

module.exports = getInterface(ConfiguratorInterface);
