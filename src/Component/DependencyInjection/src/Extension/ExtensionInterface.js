/**
 * Container extension
 *
 * @memberOf Jymfony.DependencyInjection.Extension
 */
class ExtensionInterface {
    /**
     * Load a configuration
     *
     * @function
     * @name ExtensionInterface#load
     *
     * @param {Object} configs
     * @param {ContainerBuilder} container
     */

    /**
     * Returns the extension configuration object
     *
     * @function
     * @name ExtensionInterface#getConfiguration
     *
     * @returns {ConfigurationInterface}
     */

    /**
     * Namespace to be used for this extension
     *
     * @property
     * @name ExtensionInterface#namespace
     * @type string
     */

    /**
     * Base path for the XSD files
     *
     * @property
     * @name ExtensionInterface#xsdValidationBasePath
     * @type string
     */

    /**
     * Configuration alias
     *
     * @property
     * @name ExtensionInterface#alias
     * @type string
     */
}

module.exports = getInterface(ExtensionInterface);
