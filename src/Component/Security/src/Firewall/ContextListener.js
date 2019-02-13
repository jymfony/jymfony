const EventSubscriberInterface = Jymfony.Component.EventDispatcher.EventSubscriberInterface;
const Request = Jymfony.Component.HttpFoundation.Request;
const Events = Jymfony.Component.HttpServer.Event.HttpServerEvents;
const NullLogger = Jymfony.Component.Logger.NullLogger;
const TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;
const UnsupportedUserException = Jymfony.Component.Security.Exception.UnsupportedUserException;
const UsernameNotFoundException = Jymfony.Component.Security.Exception.UsernameNotFoundException;
const ListenerInterface = Jymfony.Component.Security.Firewall.ListenerInterface;
const SwitchUserRole = Jymfony.Component.Security.Role.SwitchUserRole;
const UserInterface = Jymfony.Component.Security.User.UserInterface;
const UserProviderInterface = Jymfony.Component.Security.User.UserProviderInterface;

/**
 * ContextListener manages the SecurityContext persistence through a session.
 *
 * @memberOf Jymfony.Component.Security.Firewall
 */
class ContextListener extends implementationOf(ListenerInterface, EventSubscriberInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Security.Authentication.Token.Storage.TokenStorageInterface} tokenStorage
     * @param {Jymfony.Component.Security.User.UserProviderInterface[]} userProviders
     * @param {Jymfony.Component.Security.Authentication.AuthenticationTrustResolverInterface} authenticationTrustResolver
     * @param {string} sessionKey
     * @param {Jymfony.Component.Logger.LoggerInterface} [logger]
     */
    __construct(tokenStorage, userProviders, authenticationTrustResolver, sessionKey, logger = undefined) {
        /**
         * @type {Jymfony.Component.Security.Authentication.Token.Storage.TokenStorageInterface}
         *
         * @private
         */
        this._tokenStorage = tokenStorage;

        /**
         * @type {Jymfony.Component.Security.User.UserProviderInterface[]}
         *
         * @private
         */
        this._providers = userProviders;

        /**
         * @type {Jymfony.Component.Security.Authentication.AuthenticationTrustResolverInterface}
         *
         * @private
         */
        this._authenticationTrustResolver = authenticationTrustResolver;

        /**
         * @type {string}
         *
         * @private
         */
        this._sessionKey = sessionKey;

        /**
         * @type {Jymfony.Component.Logger.LoggerInterface}
         *
         * @private
         */
        this._logger = logger || new NullLogger();
    }

    /**
     * @param {Jymfony.Component.HttpServer.Event.GetResponseEvent} event
     *
     * @returns {Promise<void>}
     */
    async handle(event) {
        const request = event.request;
        const session = request.hasPreviousSession() ? request.session : null;
        let token;

        if (null === session || undefined === (token = session.get(this._sessionKey))) {
            this._tokenStorage.setToken(request, undefined);

            return;
        }

        try {
            token = __jymfony.unserialize(token);
        } catch (e) {
            this._logger.warning('Failed to unserialize the security token from the session.', {
                key: this._sessionKey,
                received: token,
                exception: e,
            });

            token = null;
        }

        this._logger.debug('Read existing security token from the session.', {
            key: this._sessionKey,
            token_class: ReflectionClass.getClass(token),
        });

        if (token instanceof TokenInterface) {
            token = await this._refreshUser(token);
        } else if (token) {
            this._logger.warning('Expected a security token from the session, got something else.', {
                key: this._sessionKey,
                received: token,
            });

            token = null;
        }

        this._tokenStorage.setToken(request, token);
    }

    /**
     * @param {Jymfony.Component.HttpServer.Event.FilterResponseEvent} event
     */
    onResponse(event) {
        const request = event.request;
        if (request.attributes.has(Request.ATTRIBUTE_PARENT_REQUEST) || ! request.hasSession()) {
            return;
        }

        const session = request.session;
        const token = this._tokenStorage.getToken(request);

        if (! token || this._authenticationTrustResolver.isAnonymous(token)) {
            if (request.hasPreviousSession()) {
                session.remove(this._sessionKey);
            }
        } else {
            session.set(this._sessionKey, __jymfony.serialize(token));
            this._logger.debug('Stored the security token in the session.', { key: this._sessionKey });
        }
    }

    /**
     * @inheritdoc
     */
    static getSubscribedEvents() {
        return {
            [Events.RESPONSE]: 'onResponse',
        };
    }

    /**
     * Tries to refresh the user from the authentication provider.
     *
     * @param {Jymfony.Component.Security.Authentication.Token.TokenInterface} token
     *
     * @returns {Promise<Jymfony.Component.Security.Authentication.Token.TokenInterface>}
     *
     * @protected
     */
    async _refreshUser(token) {
        const user = token.user;
        if (! (user instanceof UserInterface)) {
            return token;
        }

        let userNotFoundByProvider = false;

        for (const provider of this._providers) {
            if (! (provider instanceof UserProviderInterface)) {
                throw new InvalidArgumentException(__jymfony.sprintf('User provider "%s" must implement "Jymfony.Component.Security.User.UserProviderInterface".', ReflectionClass.getClassName(provider)));
            }

            try {
                const refreshedUser = await provider.refreshUser(user);
                token.user = refreshedUser;

                const context = { username: refreshedUser.username, provider: ReflectionClass.getClassName(provider) };

                // Tokens can be de-authenticated if the user has been changed.
                if (! token.authenticated) {
                    this._logger.debug('Token was deauthenticated after trying to refresh it.', context);

                    return undefined;
                }

                for (const role of token.roles) {
                    if (role instanceof SwitchUserRole) {
                        context.impersonator_username = role.source.username;
                    }
                }

                this._logger.debug('User was reloaded from a user provider.', context);

                return token;
            } catch (e) {
                if (e instanceof UnsupportedUserException) {
                    // Let's try the next user provider
                } else if (e instanceof UsernameNotFoundException) {
                    this._logger.debug('Username could not be found in the selected user provider.', { username: e.username, provider: ReflectionClass.getClassName(provider) });
                    userNotFoundByProvider = true;
                } else {
                    throw e;
                }
            }
        }

        if (userNotFoundByProvider) {
            return undefined;
        }

        throw new RuntimeException(__jymfony.sprintf('There is no user provider for user "%s".', ReflectionClass.getClassName(user)));
    }
}

module.exports = ContextListener;
