/**
 * @memberOf Jymfony.Component.Routing.Loader.Configurator.Traits
 */
class ConfiguratorTrait {
    __construct() {
        /**
         * @type {Jymfony.Component.Routing.Loader.Configurator.ConfiguratorInterface[]}
         *
         * @private
         */
        this._children = [];
    }

    /**
     * Adds a configurator to this configurator.
     *
     * @param {Jymfony.Component.Routing.Loader.Configurator.ConfiguratorInterface} childConfigurator
     *
     * @return {Jymfony.Component.Routing.Loader.Configurator.ConfiguratorInterface}
     *
     * @private
     */
    _push(childConfigurator) {
        this._children.push(childConfigurator);

        return childConfigurator;
    }
}

export default getTrait(ConfiguratorTrait);
