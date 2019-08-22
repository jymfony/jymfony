/**
 * Container extension.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Extension
 */
class ExtensionInterface {
    /**
     * Loads a configuration.
     *
     * @param {Object[]} configs
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     */
    load(configs, container) { }

    /**
     * Namespace to be used for this extension.
     *
     * @returns {string}
     */
    get namespace() { }

    /**
     * Base path for the XSD files.
     *
     * @returns {string}
     */
    get xsdValidationBasePath() { }

    /**
     * Configuration alias.
     *
     * @returns {string}
     */
    get alias() { }
}

export default getInterface(ExtensionInterface);
