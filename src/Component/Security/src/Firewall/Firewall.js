const EventSubscriberInterface = Jymfony.Component.EventDispatcher.EventSubscriberInterface;
const AccessDeniedHttpException = Jymfony.Component.HttpFoundation.Exception.AccessDeniedHttpException;
const Request = Jymfony.Component.HttpFoundation.Request;
const Events = Jymfony.Component.HttpServer.Event.HttpServerEvents;
const NullLogger = Jymfony.Component.Logger.NullLogger;
const AuthenticationException = Jymfony.Component.Security.Exception.AuthenticationException;
const AccessDeniedException = Jymfony.Component.Security.Exception.AccessDeniedException;
const AccountStatusException = Jymfony.Component.Security.Exception.AccountStatusException;
const InsufficientAuthenticationException = Jymfony.Component.Security.Exception.InsufficientAuthenticationException;
const LogoutException = Jymfony.Component.Security.Exception.LogoutException;
const TargetPathTrait = Jymfony.Component.Security.Http.TargetPathTrait;

/**
 * Firewall uses a FirewallMap to register security listeners for the given
 * request.
 *
 * It allows for different security strategies within the same application
 * (a Basic authentication for the /api, and a web based authentication for
 * everything else for instance).
 *
 * @memberOf Jymfony.Component.Security.Firewall
 */
class Firewall extends implementationOf(EventSubscriberInterface, TargetPathTrait) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Security.Firewall.FirewallMapInterface} map
     * @param {Jymfony.Component.Security.Authentication.Token.Storage.TokenStorage} tokenStorage
     * @param {Jymfony.Component.Security.Authentication.AuthenticationTrustResolverInterface} authenticationTrustResolver
     * @param {Jymfony.Component.Logger.LoggerInterface} [logger]
     */
    __construct(map, tokenStorage, authenticationTrustResolver, logger = undefined) {
        /**
         * @type {Jymfony.Component.Security.Firewall.FirewallMapInterface}
         *
         * @private
         */
        this._map = map;

        /**
         * @type {Jymfony.Component.Security.Authentication.Token.Storage.TokenStorage}
         *
         * @private
         */
        this._tokenStorage = tokenStorage;

        /**
         * @type {Jymfony.Component.Security.Authentication.AuthenticationTrustResolverInterface}
         *
         * @private
         */
        this._authenticationTrustResolver = authenticationTrustResolver;

        /**
         * @type {Jymfony.Component.Logger.LoggerInterface}
         *
         * @private
         */
        this._logger = logger || new NullLogger();

        /**
         * @type {WeakMap<Jymfony.Component.HttpFoundation.Request, *>}
         *
         * @private
         */
        this._requestMap = new WeakMap();
    }

    /**
     * @param {Jymfony.Component.HttpServer.Event.GetResponseEvent} event
     */
    async onRequest(event) {
        const request = event.request;
        if (request.attributes.has(Request.ATTRIBUTE_PARENT_REQUEST)) {
            return;
        }

        const firewallConfig = this._map.getConfig(request);
        this._requestMap.set(request, firewallConfig);

        for (const listener of firewallConfig.authenticationListeners) {
            await listener.handle(event);

            if (event.hasResponse()) {
                break;
            }
        }

        await this._handleLogout(event, firewallConfig);
    }

    /**
     * @param {Jymfony.Component.HttpServer.Event.GetResponseForExceptionEvent} event
     */
    async onException(event) {
        const request = event.request;
        const firewallConfig = this._requestMap.get(request);

        if (undefined === firewallConfig) {
            return;
        }

        let exception = event.exception;
        do {
            if (exception instanceof AuthenticationException) {
                return await this._handleAuthenticationException(event, exception);
            } else if (exception instanceof AccessDeniedException) {
                return await this._handleAccessDeniedException(event, firewallConfig, exception);
            } else if (exception instanceof LogoutException) {
                return await this._handleLogoutException(exception);
            }
        } while ((exception = exception.previous));
    }

    /**
     * Handles an AuthenticationException.
     *
     * @param {Jymfony.Component.HttpServer.Event.GetResponseEvent} event
     * @param {Jymfony.Component.Security.Exception.AuthenticationException} exception
     *
     * @returns {Promise<void>}
     *
     * @protected
     */
    async _handleAuthenticationException(event, exception) {
        this._logger.info('An AuthenticationException was thrown; redirecting to authentication entry point.', { exception: exception });

        try {
            event.response = this._startAuthentication(event.request, exception);
            event.allowCustomResponseCode();
        } catch (e) {
            event.exception = e;
        }
    }

    /**
     * Handles a logout exception.
     *
     * @param {Jymfony.Component.HttpServer.Event.GetResponseEvent} event
     * @param {Jymfony.Component.Security.Exception.AuthenticationException} exception
     *
     * @returns {Promise<void>}
     *
     * @protected
     */
    async _handleLogoutException(event, exception) {
        this._logger.info('A LogoutException was thrown.', { exception: exception });
    }

    /**
     * Handles a logout request.
     *
     * @param {Jymfony.Component.HttpServer.Event.GetResponseEvent} event
     * @param {Jymfony.Component.Security.Firewall.FirewallConfig} config
     *
     * @returns {Promise<void>}
     *
     * @protected
     */
    async _handleLogout(event, config) {
        const handler = config.logoutHandler;
        if (undefined === handler) {
            return;
        }

        await handler.handle(event);
    }

    /**
     * Handles an access denied exception.
     *
     * @param {Jymfony.Component.HttpServer.Event.GetResponseForExceptionEvent} event
     * @param {Jymfony.Component.Security.Firewall.FirewallConfig} firewall
     * @param {Jymfony.Component.Security.Exception.AccessDeniedException} exception
     */
    async _handleAccessDeniedException(event, firewall, exception) {
        event.exception = new AccessDeniedHttpException(exception.message, exception);

        const token = this._tokenStorage.getToken(event.request);
        if (! this._authenticationTrustResolver.isFullFledged(token)) {
            this._logger.debug('Access denied, the user is not fully authenticated; redirecting to authentication entry point.', { exception });

            try {
                const insufficientAuthenticationException = new InsufficientAuthenticationException('Full authentication is required to access this resource.', 0, exception);
                insufficientAuthenticationException.token = token;

                event.response = this._startAuthentication(event.request, firewall, insufficientAuthenticationException);
            } catch (e) {
                event.exception = e;
            }

            return;
        }

        this._logger.debug('Access denied, the user is neither anonymous, nor remember-me.', { exception });

        try {
            if (firewall.accessDeniedHandler) {
                const response = await firewall.accessDeniedHandler.handle(event.request, exception);

                if (response instanceof Response) {
                    event.response = response;
                }
            }
        } catch (e) {
            this._logger.error('An exception was thrown when handling an AccessDeniedException.', { exception: e });

            event.exception = new RuntimeException('Exception thrown when handling an exception.', 0, e);
        }
    }

    /**
     * @param {Jymfony.Component.HttpFoundation.Request} request
     * @param {Jymfony.Component.Security.Firewall.FirewallConfig} firewall
     * @param {Jymfony.Component.Security.Exception.InsufficientAuthenticationException} authException
     */
    _startAuthentication(request, firewall, authException) {
        if (! firewall.entryPoint) {
            throw authException;
        }

        this._logger.debug('Calling Authentication entry point.');

        if (! firewall.stateless) {
            // Session isn't required when using HTTP basic authentication mechanism for example
            if (request.hasSession() && request.isMethodSafe && ! request.isXmlHttpRequest) {
                this._saveTargetPath(request.session, firewall.name, request.uri);
            }
        }

        if (authException instanceof AccountStatusException) {
            // Remove the security token to prevent infinite redirect loops
            this._tokenStorage.setToken(request, undefined);
            this._logger.info('The security token was removed due to an AccountStatusException.', { exception: authException });
        }

        const response = firewall.entryPoint.start(request, authException);

        if (! (response instanceof Response)) {
            const given = isObject(response) ? ReflectionClass.getClassName(response) : typeof response;
            throw new LogicException(__jymfony.sprintf('The %s.start() method must return a Response object (%s returned)', ReflectionClass.getClassName(firewall.entryPoint), given));
        }

        return response;
    }

    /**
     * @inheritdoc
     */
    static getSubscribedEvents() {
        return {
            [Events.REQUEST]: [ 'onRequest', 8 ],
            [Events.EXCEPTION]: [ 'onException', 1 ],
        };
    }
}

module.exports = Firewall;
