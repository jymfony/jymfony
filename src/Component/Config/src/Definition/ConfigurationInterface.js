/**
 * Configuration interface.
 *
 * @memberOf Jymfony.Component.Config.Definition
 */
class ConfigurationInterface {
    /**
     * Generates the configuration tree builder.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.TreeBuilder} The tree builder
     */
    get configTreeBuilder() { }
}

export default getInterface(ConfigurationInterface);
