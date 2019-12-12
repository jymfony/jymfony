const AuthorizationCheckerInterface = Jymfony.Component.Security.Authorization.AuthorizationCheckerInterface;
const AuthenticationCredentialsNotFoundException = Jymfony.Component.Security.Exception.AuthenticationCredentialsNotFoundException;

/**
 * @memberOf Jymfony.Component.Security.Authorization
 */
export default class AuthorizationChecker extends implementationOf(AuthorizationCheckerInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Security.Authorization.AccessDecisionManagerInterface} accessDecisionManager
     */
    __construct(accessDecisionManager) {
        /**
         * @type {Jymfony.Component.Security.Authorization.AccessDecisionManagerInterface}
         *
         * @private
         */
        this._accessDecisionManager = accessDecisionManager;
    }

    /**
     * @inheritdoc
     */
    isGranted(token, attributes, subject = undefined) {
        if (! token) {
            throw new AuthenticationCredentialsNotFoundException('The token storage contains no authentication token. One possible reason may be that there is no firewall configured for this URL.');
        }

        if (! isArray(attributes)) {
            attributes = [ attributes ];
        }

        return this._accessDecisionManager.decide(token, attributes, subject);
    }
}
