/**
 * @memberOf Jymfony.Component.Security.Firewall
 */
export default class FirewallConfig {
    /**
     * Constructor.
     *
     * @param {string} [name = ""]
     * @param {boolean} [enabled = false]
     * @param {Jymfony.Component.Security.User.UserCheckerInterface} [userChecker]
     * @param {Jymfony.Component.HttpFoundation.RequestMatcherInterface} [requestMatcher]
     * @param {boolean} [stateless = true]
     * @param {Jymfony.Component.Security.User.UserProviderInterface} [userProvider]
     * @param {Jymfony.Component.Security.Authentication.EntryPoint.EntryPointInterface} [entryPoint]
     * @param {Jymfony.Component.Security.Authorization.AccessDeniedHandlerInterface} [accessDeniedHandler]
     * @param {Jymfony.Component.Security.Firewall.ListenerInterface[]} [authenticationListeners = []]
     * @param {Jymfony.Component.Security.Firewall.ListenerInterface} [logoutHandler]
     */
    __construct(
        name = '',
        enabled = false,
        userChecker = undefined,
        requestMatcher = undefined,
        stateless = true,
        userProvider = undefined,
        entryPoint = undefined,
        accessDeniedHandler = undefined,
        authenticationListeners = [],
        logoutHandler = undefined
    ) {
        /**
         * @type {string}
         *
         * @private
         */
        this._name = name;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._enabled = enabled;

        /**
         * @type {Jymfony.Component.Security.User.UserCheckerInterface}
         *
         * @private
         */
        this._userChecker = userChecker;

        /**
         * @type {Jymfony.Component.HttpFoundation.RequestMatcherInterface}
         *
         * @private
         */
        this._requestMatcher = requestMatcher;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._stateless = stateless;

        /**
         * @type {Jymfony.Component.Security.User.UserProviderInterface}
         *
         * @private
         */
        this._userProvider = userProvider;

        /**
         * @type {Jymfony.Component.Security.Authentication.EntryPoint.EntryPointInterface}
         *
         * @private
         */
        this._entryPoint = entryPoint;

        /**
         * @type {Jymfony.Component.Security.Authorization.AccessDeniedHandlerInterface}
         *
         * @private
         */
        this._accessDeniedHandler = accessDeniedHandler;

        /**
         * @type {Jymfony.Component.Security.Firewall.ListenerInterface[]}
         *
         * @private
         */
        this._authenticationListeners = authenticationListeners;

        /**
         * @type {Jymfony.Component.Security.Firewall.ListenerInterface}
         *
         * @private
         */
        this._logoutHandler = logoutHandler;
    }

    /**
     * Gets the firewall name.
     *
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * Whether the security is enabled or not on this firewall.
     *
     * @returns {boolean}
     */
    get enabled() {
        return this._enabled;
    }

    /**
     * Gets the user checker, if set.
     *
     * @returns {undefined|Jymfony.Component.Security.User.UserCheckerInterface}
     */
    get userChecker() {
        return this._userChecker;
    }

    /**
     * Gets the request matcher for the current firewall.
     *
     * @returns {Jymfony.Component.HttpFoundation.RequestMatcherInterface}
     */
    get requestMatcher() {
        return this._requestMatcher;
    }

    /**
     * Whether this firewall preserves session state or not.
     *
     * @returns {boolean}
     */
    get stateless() {
        return this._stateless;
    }

    /**
     * Gets the user provider, if set.
     *
     * @returns {undefined|Jymfony.Component.Security.User.UserProviderInterface}
     */
    get userProvider() {
        return this._userProvider;
    }

    /**
     * Gets the authentication entry point.
     *
     * @returns {Jymfony.Component.Security.Authentication.EntryPoint.EntryPointInterface}
     */
    get entryPoint() {
        return this._entryPoint;
    }

    /**
     * Gets the access denied handler.
     *
     * @returns {Jymfony.Component.Security.Authorization.AccessDeniedHandlerInterface}
     */
    get accessDeniedHandler() {
        return this._accessDeniedHandler;
    }

    /**
     * Gets a copy of the authentication listener array.
     *
     * @returns {Jymfony.Component.Security.Firewall.ListenerInterface[]}
     */
    get authenticationListeners() {
        return [ ...this._authenticationListeners ];
    }

    /**
     * Gets the logout handler.
     *
     * @returns {Jymfony.Component.Security.Firewall.ListenerInterface}
     */
    get logoutHandler() {
        return this._logoutHandler;
    }
}
