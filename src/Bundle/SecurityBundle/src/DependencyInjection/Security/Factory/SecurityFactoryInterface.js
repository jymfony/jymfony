/**
 * SecurityFactoryInterface is the interface for all security authentication listener.
 *
 * @memberOf Jymfony.Bundle.SecurityBundle.DependencyInjection.Security.Factory
 */
class SecurityFactoryInterface {
    /**
     * Configures the container services required to use the authentication listener.
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {string} id The unique id of the firewall
     * @param {Object.<string, *>} config The options array for the listener
     * @param {string} userProvider The service id of the user provider
     * @param {string} defaultEntryPoint
     *
     * @returns {string[]} containing three values:
     *                       - the provider id
     *                       - the listener id
     *                       - the entry point id
     */
    create(container, id, config, userProvider, defaultEntryPoint) { }

    /**
     * Defines the position at which the provider is called.
     * Possible values: pre_auth, form, http, and remember_me.
     *
     * @returns {string}
     */
    getPosition() { }

    /**
     * Defines the configuration key used to reference the provider
     * in the firewall configuration.
     *
     * @returns {string}
     */
    getKey() { }

    /**
     * Adds configuration nodes for security configuration.
     *
     * @param {Jymfony.Component.Config.Definition.Builder.NodeBuilder} builder
     */
    addConfiguration(builder) { }
}

export default getInterface(SecurityFactoryInterface);
