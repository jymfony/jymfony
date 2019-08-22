/**
 * UserProviderFactoryInterface is the interface for all user provider factories.
 *
 * @memberOf Jymfony.Bundle.SecurityBundle.DependencyInjection.UserProvider
 */
class UserProviderFactoryInterface {
    /**
     * Creates the user provider service.
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {string} id
     * @param {Object.<string, *>} config
     */
    create(container, id, config) { }

    /**
     * Gets the user provider factory key (used in configuration).
     *
     * @returns {string}
     */
    getKey() { }

    /**
     * Adds the configuration to the node builder.
     *
     * @param {Jymfony.Component.Config.Definition.Builder.NodeDefinition} builder
     */
    addConfiguration(builder) { }
}

export default getInterface(UserProviderFactoryInterface);
