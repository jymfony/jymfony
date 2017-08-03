/**
 * Container extension
 *
 * @memberOf Jymfony.Component.DependencyInjection.Extension
 */
class ExtensionInterface {
    /**
     * Load a configuration
     *
     * @param {*} configs
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     */
    load(configs, container) { }

    /**
     * Returns the extension configuration object
     *
     * @returns {Jymfony.Component.Config.Definition.ConfigurationInterface}
     */
    getConfiguration() { }

    /**
     * Namespace to be used for this extension
     *
     * @returns {string}
     */
    get namespace() { }

    /**
     * Base path for the XSD files
     *
     * @returns {string}
     */
    get xsdValidationBasePath() { }

    /**
     * Configuration alias
     *
     * @returns {string}
     */
    get alias() { }
}

module.exports = getInterface(ExtensionInterface);
