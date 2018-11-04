const SecurityFactoryInterface = Jymfony.Bundle.SecurityBundle.DependencyInjection.Security.Factory.SecurityFactoryInterface;

/**
 * AbstractFactory is the base class for all classes inheriting from
 * AbstractAuthenticationListener.
 *
 * @memberOf Jymfony.Bundle.SecurityBundle.DependencyInjection.Security.Factory
 */
class AbstractFactory extends implementationOf(SecurityFactoryInterface) {
    __construct() {
        /**
         * @type {Object.<string, *>}
         *
         * @protected
         */
        this._options = {};
    }

    create(container, id, config, userProviderId, defaultEntryPointId) {
        // Authentication provider
        const authProviderId = this._createAuthProvider(container, id, config, userProviderId);

        // Authentication listener
        const listenerId = this._createListener(container, id, config, userProviderId);

        // Add remember-me aware tag if requested
        if (this._isRememberMeAware(config)) {
            container
                .getDefinition(listenerId)
                .addTag('security.remember_me_aware', { id, provider: userProviderId })
            ;
        }

        // Create entry point if applicable (optional)
        const entryPointId = this._createEntryPoint(container, id, config, defaultEntryPointId);

        return [ authProviderId, listenerId, entryPointId ];
    }

    /**
     * Adds a configuration.
     *
     * @param {Jymfony.Component.Config.Definition.Builder.NodeBuilder} node
     */
    addConfiguration(node) {
        const builder = node.children();

        builder
            .scalarNode('provider').end()
            .booleanNode('remember_me').defaultTrue().end()
        ;

        for (const [ name, defaultValue ] of __jymfony.getEntries(this._options)) {
            if (isBoolean(defaultValue)) {
                builder.booleanNode(name).defaultValue(defaultValue);
            } else {
                builder.scalarNode(name).defaultValue(defaultValue);
            }
        }
    }

    /**
     * Adds an option.
     *
     * @param {string} name
     * @param {*} [defaultValue]
     *
     * @final
     */
    addOption(name, defaultValue = undefined) {
        this._options[name] = defaultValue;
    }

    /**
     * Subclasses must return the id of a service which implements the
     * AuthenticationProviderInterface.
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {string} id The unique id of the firewall
     * @param {Object.<string, *>} config The options array for this listener
     * @param {string} userProviderId The id of the user provider
     *
     * @returns {string} never null, the id of the authentication provider
     *
     * @abstract
     *
     * @protected
     */
    _createAuthProvider(container, id, config, userProviderId) { } // eslint-disable-line no-unused-vars

    /**
     * Creates an authentication listener.
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {string} id
     * @param {Object.<string, *>} config
     * @param {string} userProviderId
     *
     * @returns {string}
     *
     * @abstract
     *
     * @protected
     */
    _createListener(container, id, config, userProviderId) { } // eslint-disable-line no-unused-vars

    /**
     * Subclasses may create an entry point of their as they see fit. The
     * default implementation does not change the default entry point.
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {string} id
     * @param {Object.<string, *>} config
     * @param {string} defaultEntryPointId
     *
     * @returns {string} the entry point id
     *
     * @protected
     */
    _createEntryPoint(container, id, config, defaultEntryPointId) {
        return defaultEntryPointId;
    }

    /**
     * Subclasses may disable remember-me features for the listener, by
     * always returning false from this method.
     *
     * @param {Object.<string, *>} config
     *
     * @returns {boolean} Whether a possibly configured RememberMeServices should be set for this listener
     *
     * @protected
     */
    _isRememberMeAware(config) {
        return config.remember_me;
    }
}

module.exports = AbstractFactory;
