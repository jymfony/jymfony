const AccessDeniedException = Jymfony.Component.Security.Exception.AccessDeniedException;
const AuthenticationCredentialsNotFoundException = Jymfony.Component.Security.Exception.AuthenticationCredentialsNotFoundException;
const ListenerInterface = Jymfony.Component.Security.Firewall.ListenerInterface;

/**
 * AccessListener enforces access control rules.
 *
 * @memberOf Jymfony.Component.Security.Firewall
 */
export default class AccessListener extends implementationOf(ListenerInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Security.Authentication.Token.Storage.TokenStorageInterface} tokenStorage
     * @param {Jymfony.Component.Security.Authorization.AccessDecisionManagerInterface} accessDecisionManager
     * @param {Jymfony.Component.Security.Authorization.AccessMapInterface} accessMap
     * @param {Jymfony.Component.Security.Authentication.AuthenticationManagerInterface} authenticationManager
     */
    __construct(tokenStorage, accessDecisionManager, accessMap, authenticationManager) {
        /**
         * @type {Jymfony.Component.Security.Authentication.Token.Storage.TokenStorageInterface}
         *
         * @private
         */
        this._tokenStorage = tokenStorage;

        /**
         * @type {Jymfony.Component.Security.Authorization.AccessDecisionManagerInterface}
         *
         * @private
         */
        this._accessDecisionManager = accessDecisionManager;

        /**
         * @type {Jymfony.Component.Security.Authorization.AccessMapInterface}
         *
         * @private
         */
        this._accessMap = accessMap;

        /**
         * @type {Jymfony.Component.Security.Authentication.AuthenticationManagerInterface}
         *
         * @private
         */
        this._authManager = authenticationManager;
    }

    /**
     * @param {Jymfony.Contracts.HttpServer.Event.RequestEvent} event
     *
     * @returns {Promise<void>}
     */
    async handle(event) {
        const request = event.request;
        let token = this._tokenStorage.getToken(request);
        if (! token) {
            throw new AuthenticationCredentialsNotFoundException('A Token was not found in the TokenStorage.');
        }

        const attributes = this._accessMap.getPatterns(request)[0];
        if (undefined === attributes) {
            return;
        }

        if (! token.authenticated) {
            token = await this._authManager.authenticate(token);
            this._tokenStorage.setToken(request, token);
        }

        if (! this._accessDecisionManager.decide(token, attributes, request)) {
            const exception = new AccessDeniedException();
            exception.attributes = attributes;
            exception.subject = request;

            throw exception;
        }
    }
}
