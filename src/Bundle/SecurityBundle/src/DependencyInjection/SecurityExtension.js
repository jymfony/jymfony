const InvalidConfigurationException = Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException;
const FileLocator = Jymfony.Component.Config.FileLocator;
const Alias = Jymfony.Component.DependencyInjection.Alias;
const IteratorArgument = Jymfony.Component.DependencyInjection.Argument.IteratorArgument;
const ChildDefinition = Jymfony.Component.DependencyInjection.ChildDefinition;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const Reference = Jymfony.Component.DependencyInjection.Reference;
const Parameter = Jymfony.Component.DependencyInjection.Parameter;
const JsFileLoader = Jymfony.Component.DependencyInjection.Loader.JsFileLoader;
const Extension = Jymfony.Component.DependencyInjection.Extension.Extension;
const UserProviderInterface = Jymfony.Component.Security.User.UserProviderInterface;

const path = require('path');

/**
 * @memberOf Jymfony.Bundle.SecurityBundle.DependencyInjection
 */
class SecurityExtension extends Extension {
    /**
     * Constructor.
     */
    __construct() {
        super.__construct();

        /**
         * @type {Jymfony.Bundle.SecurityBundle.DependencyInjection.UserProvider.UserProviderFactoryInterface[]}
         *
         * @private
         */
        this._userProviderFactories = [];

        /**
         * @type {Object.<string, Jymfony.Bundle.SecurityBundle.DependencyInjection.Security.Factory.SecurityFactoryInterface[]>}
         *
         * @private
         */
        this._factories = {
            pre_auth: [],
            form: [],
            http: [],
            remember_me: [],
        };
    }

    /**
     * Load a configuration
     *
     * @param {*} configs
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     */
    load(configs, container) {
        const configuration = this.getConfiguration(container);
        configuration.userProviderFactories = this._userProviderFactories;
        configuration.factories = this._factories;

        const config = this._processConfiguration(configuration, configs);

        if (! config.enabled) {
            return;
        }

        const loader = new JsFileLoader(container, new FileLocator(path.join(__dirname, '..', 'Resources', 'config')));
        loader.load('security.js');
        loader.load('security_listeners.js');

        if (container.hasParameter('kernel.debug') && container.getParameter('kernel.debug')) {
            loader.load('security_debug.js');
        }

        container.setParameter('security.access.denied_url', config.access_denied_url);
        container.setParameter('security.authentication.manager.erase_credentials', config.erase_credentials);
        container.setParameter('security.authentication.session_strategy.strategy', config.session_fixation_strategy);

        if (config.access_decision_manager.service) {
            container.setAlias(Jymfony.Component.Security.Authorization.AccessDecisionManagerInterface, new Alias(config.access_decision_manager.service));
        } else {
            container
                .getDefinition(Jymfony.Component.Security.Authorization.AccessDecisionManager)
                .addArgument(config.access_decision_manager.strategy)
                .addArgument(config.access_decision_manager.allow_if_all_abstain)
                .addArgument(config.access_decision_manager.allow_if_equal_granted_denied);
        }

        container.setParameter('security.authentication.hide_user_not_found', config.hide_user_not_found);

        this._createFirewalls(config, container);
        this._createAuthorization(config, container);
        this._createRoleHierarchy(config, container);

        if (config.encoders && 0 < Object.keys(config.encoders).length) {
            container.getDefinition(Jymfony.Component.Security.Encoder.EncoderFactory).replaceArgument(0, config.encoders);
        }

        if (ReflectionClass.exists('Jymfony.Component.Console.Application')) {
            loader.load('console.js');
            container.getDefinition('security.command.user_password_encoder').replaceArgument(1, Object.keys(config.encoders));
        }
    }

    /**
     * Adds a security listener factory.
     *
     * @param {Jymfony.Bundle.SecurityBundle.DependencyInjection.Security.Factory.SecurityFactoryInterface} factory
     */
    addSecurityListenerFactory(factory) {
        this._factories[factory.getPosition()].push(factory);
    }

    /**
     * Adds a user provider factory.
     *
     * @param {Jymfony.Bundle.SecurityBundle.DependencyInjection.UserProvider.UserProviderFactoryInterface} factory
     */
    addUserProviderFactory(factory) {
        this._userProviderFactories.push(factory);
    }

    /**
     * Creates the firewalls.
     *
     * @param {*} config
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     *
     * @private
     */
    _createFirewalls(config, container) {
        const firewalls = config.firewalls;
        if (! firewalls || 0 === Object.keys(firewalls).length) {
            return;
        }

        const providerIds = this._createUserProviders(config, container);
        const contextListenerDefinition = new ChildDefinition('security.context_listener');

        const userProviders = [];
        for (const providerId of Object.values(providerIds)) {
            userProviders.push(new Reference(providerId));
        }

        contextListenerDefinition.replaceArgument(1, new IteratorArgument(userProviders));
        if (1 === Object.keys(providerIds).length) {
            container.setAlias(UserProviderInterface, providerIds[0]);
        }

        let customUserChecker = false;

        const mapDef = container.getDefinition('security.firewall.map');
        const authenticationProviders = new Set();

        for (const [ name, firewall ] of __jymfony.getEntries(firewalls)) {
            if (firewall.user_checker && 'security.user_checker' !== firewall.user_checker) {
                customUserChecker = true;
            }

            const configId = 'security.firewall.map.config.'+name;
            this._createFirewall(container, name, firewall, authenticationProviders, providerIds, configId);

            mapDef.addMethodCall('add', [ new Reference(configId) ]);
        }

        container
            .getDefinition(Jymfony.Component.Security.Authentication.AuthenticationProviderManager)
            .replaceArgument(0, new IteratorArgument([ ...authenticationProviders ].map(id => new Reference(id))))
        ;

        if (! customUserChecker) {
            container.setAlias(Jymfony.Component.Security.User.UserCheckerInterface, new Alias('security.user_checker'));
        }
    }

    /**
     * Create and register user provider services.
     *
     * @param {Object.<string, *>} config
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     *
     * @returns {Object.<string, string>}
     *
     * @private
     */
    _createUserProviders(config, container) {
        const providerIds = {};
        for (const [ name, provider ] of __jymfony.getEntries(config.providers)) {
            providerIds[name.replace(/-/g, '_')] = this._createUserDaoProvider(name, provider, container);
        }

        return providerIds;
    }

    /**
     * Parses a provider and returns the id for the related user provider service
     *
     * @param {string} name
     * @param {Object.<string, *>} provider
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     *
     * @returns {string}
     *
     * @private
     */
    _createUserDaoProvider(name, provider, container) {
        name = this._getUserProviderId(name);

        for (const factory of this._userProviderFactories) {
            const key = factory.getKey().replace(/-/g, '_');

            if (provider[key]) {
                factory.create(container, name, provider[key]);

                return name;
            }
        }

        // Existing DAO service provider
        if (provider.id) {
            container.setAlias(name, new Alias(provider.id));

            return provider.id;
        }

        // Chain provider
        if (provider.chain) {
            const providers = [];
            for (const providerName of provider.chain.providers) {
                providers.push(new Reference(this._getUserProviderId(providerName)));
            }

            container
                .setDefinition(name, new ChildDefinition('security.user.provider.chain'))
                .addArgument(new IteratorArgument(providers));

            return name;
        }

        throw new InvalidConfigurationException(__jymfony.sprintf('Unable to create definition for "%s" user provider', name));
    }

    /**
     * Generate a provider service id.
     *
     * @param {string} name
     *
     * @returns {string}
     */
    _getUserProviderId(name) {
        return 'security.user.provider.concrete.'+name.toLowerCase();
    }

    /**
     * Creates firewall services from configuration.
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {string} name
     * @param {Object.<string, *>} firewall
     * @param {Set<Jymfony.Component.Security.Authentication.Provider.AuthenticationProviderInterface[]>} authenticationProviders
     * @param {Object.<string, string>} providerIds
     * @param {string} configId
     *
     * @private
     */
    _createFirewall(container, name, firewall, authenticationProviders, providerIds, configId) {
        const config = container.register(configId, Jymfony.Component.Security.Firewall.FirewallConfig);
        const userChecker = firewall.user_checker || 'security.user_checker';

        let matcher;
        if (firewall.request_matcher) {
            matcher = new Reference(firewall.request_matcher);
        } else if (firewall.host || firewall.pattern) {
            matcher = this._createRequestMatcher(firewall.pattern, firewall.host, firewall.methods, [], {}, firewall.schemes);
        }

        // Security disabled?
        if (! firewall.enabled) {
            config.setArguments([ name, false, undefined, matcher ]);
            return;
        }

        let provider = undefined;
        if (firewall.provider) {
            const normalizedName = firewall.provider.replace(/-/g, '_');
            if (! providerIds[normalizedName]) {
                throw new InvalidConfigurationException(
                    __jymfony.sprintf('Invalid firewall "%s": user provider "%s" not found.', name, firewall.provider)
                );
            }

            provider = providerIds[normalizedName];
        } else if (1 === Object.keys(providerIds).length) {
            provider = Object.values(providerIds)[0];
        }

        const [ authListeners, defaultEntryPoint ] = this._createAuthenticationListeners(container, name, firewall, authenticationProviders, provider, providerIds, firewall.entry_point);

        let access_denied_handler;
        if (firewall.access_denied_handler) {
            access_denied_handler = new Reference(firewall.access_denied_handler);
        } else if (firewall.access_denied_path) {
            access_denied_handler = new Definition(Jymfony.Component.Security.Authorization.AccessDeniedPageHandler, [
                new Reference(Jymfony.Component.Security.Http.HttpUtils),
                new Reference(Jymfony.Component.HttpServer.HttpServer),
                firewall.access_denied_path,
            ]);
        }

        // Access Listener
        authListeners.push(new Reference('security.access_listener'));

        let logoutHandler;
        if (firewall.logout && 0 < Object.keys(firewall.logout).length && true !== firewall.stateless) {
            logoutHandler = new ChildDefinition('security.logout_listener');
            logoutHandler.replaceArgument(1, firewall.logout.path);
            logoutHandler.replaceArgument(2, firewall.logout.target);

            if (firewall.logout.invalidate_session) {
                logoutHandler.addMethodCall('addHandler', new Reference(Jymfony.Component.Security.Logout.SessionLogoutHandler));
            }

            if (firewall.logout.delete_cookies.length) {
                // @todo
            }

            if (firewall.logout.handlers) {
                for (const handler of firewall.logout.handlers) {
                    logoutHandler.addMethodCall('addHandler', new Reference(handler));
                }
            }
        }

        config
            .addArgument(name)
            .addArgument(true)
            .addArgument(new Reference(userChecker))
            .addArgument(matcher)
            .addArgument(true === firewall.stateless)
            .addArgument(provider ? new Reference(provider) : undefined)
            .addArgument(defaultEntryPoint ? new Reference(defaultEntryPoint) : undefined)
            .addArgument(access_denied_handler)
            .addArgument(new IteratorArgument(authListeners.map(id => new Reference(id))))
            .addArgument(logoutHandler)
        ;
    }

    /**
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {string} id
     * @param {Object.<string, *>} firewall
     * @param {Set<Jymfony.Component.Security.Authentication.Provider.AuthenticationProviderInterface[]>} authenticationProviders
     * @param {string} defaultProvider
     * @param {Object.<string, string>} providerIds
     * @param {string} defaultEntryPoint
     *
     * @returns {*}
     *
     * @private
     */
    _createAuthenticationListeners(container, id, firewall, authenticationProviders, defaultProvider, providerIds, defaultEntryPoint) {
        const listeners = [];
        let hasListeners = false;

        for (const position of [ 'pre_auth', 'form', 'http', 'remember_me' ]) {
            for (const factory of this._factories[position]) {
                const key = factory.getKey().replace(/-/g, '_', );

                if (firewall[key]) {
                    let userProvider;
                    if (firewall[key].provider) {
                        const normalizedName = firewall[key].provider.replace(/-/g, '_');
                        if (! providerIds[normalizedName]) {
                            throw new InvalidConfigurationException(__jymfony.sprintf('Invalid firewall "%s": user provider "%s" not found.', id, firewall[key]['provider']));
                        }

                        userProvider = providerIds[normalizedName];
                    } else if ('remember_me' === key) {
                        // RememberMeFactory will use the firewall secret when created
                        userProvider = null;
                    } else if (defaultProvider) {
                        userProvider = defaultProvider;
                    } else if (! providerIds || 0 === Object.keys(providerIds).length) {
                        userProvider = __jymfony.sprintf('security.user.provider.missing.%s', key);
                        container.setDefinition(userProvider, (new ChildDefinition('security.user.provider.missing')).replaceArgument(0, id));
                    } else {
                        throw new InvalidConfigurationException(__jymfony.sprintf('Not configuring explicitly the provider for the "%s" listener on "%s" firewall is ambiguous as there is more than one registered provider.', key, id));
                    }

                    const results = factory.create(container, id, firewall[key], userProvider, defaultEntryPoint);
                    const [ provider, listenerId ] = results;
                    defaultEntryPoint = results[2];

                    listeners.push(new Reference(listenerId));
                    authenticationProviders.add(provider);
                    hasListeners = true;
                }
            }
        }

        // Anonymous
        if (firewall.anonymous) {
            if (undefined === firewall.anonymous.secret || null === firewall.anonymous.secret) {
                firewall.anonymous.secret = new Parameter('container.build_hash');
            }

            const listenerId = 'security.authentication.listener.anonymous.' + id;
            container
                .setDefinition(listenerId, new ChildDefinition('Jymfony.Component.Security.Firewall.AnonymousAuthenticationListener'))
                .replaceArgument(1, firewall['anonymous']['secret'])
            ;

            listeners.push(new Reference(listenerId));

            const providerId = 'security.authentication.provider.anonymous.' + id;
            container
                .setDefinition(providerId, new ChildDefinition('Jymfony.Component.Security.Authentication.Provider.AnonymousAuthenticationProvider'))
                .replaceArgument(0, firewall['anonymous']['secret'])
            ;

            authenticationProviders.add(providerId);
            hasListeners = true;
        }

        if (false === hasListeners) {
            throw new InvalidConfigurationException(__jymfony.sprintf('No authentication listener registered for firewall "%s".', id));
        }

        listeners.push(new Reference('security.access_listener'));

        return [ listeners, defaultEntryPoint ];
    }

    /**
     * Creates a request matcher for the given firewall configuration.
     *
     * @param {string} [path]
     * @param {string} [host]
     * @param {string|string[]} [methods]
     * @param {string|string[]} [ips = []]
     * @param {Object.<string, *>} [attributes = {}]
     * @param {string|string[]} [schemes]
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     *
     * @private
     */
    _createRequestMatcher(path = undefined, host = undefined, methods = undefined, ips = [], attributes = {}, schemes = undefined) {
        const normalize = arg => {
            if (undefined !== arg) {
                arg = Object.values(arg);
                if (0 === arg.length) {
                    return undefined;
                }
            }

            return arg;
        };

        const def = new Definition(Jymfony.Component.HttpFoundation.RequestMatcher);
        def.setArguments([ path, host, normalize(methods), Object.values(ips), attributes, normalize(schemes) ]);

        return def;
    }

    /**
     * Create authorization services and access map.
     *
     * @param {Object.<string, *>} config
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     *
     * @private
     */
    _createAuthorization(config, container) {
        for (const access of Object.values(config.access_control)) {
            const matcher = this._createRequestMatcher(
                access.path,
                access.host,
                access.methods,
                access.ips
            );

            const attributes = access.roles;

            container.getDefinition(Jymfony.Component.Security.Authorization.AccessMap)
                .addMethodCall('add', [ matcher, attributes, access.requires_channel ]);
        }
    }

    /**
     * Creates the role hierarchy parameters.
     *
     * @param {*} config
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     *
     * @private
     */
    _createRoleHierarchy(config, container) {
        if (! config.role_hierarchy || 0 === Object.keys(config.role_hierarchy).length) {
            container.removeDefinition(Jymfony.Component.Security.Authorization.Voter.RoleHierarchyVoter);

            return;
        }

        container.setParameter('security.role_hierarchy.roles', config.role_hierarchy);
        container.removeDefinition(Jymfony.Component.Security.Authorization.Voter.RoleVoter);
    }
}

module.exports = SecurityExtension;
