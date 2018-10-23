const AuthorizationCheckerInterface = Jymfony.Component.Security.Authorization.AuthorizationCheckerInterface;

/**
 * @memberOf Jymfony.Component.Security.Authorization
 */
class AuthorizationChecker extends implementationOf(AuthorizationCheckerInterface) {
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
        if (! isArray(attributes)) {
            attributes = [ attributes ];
        }

        return this._accessDecisionManager.decide(token, attributes, subject);
    }
}

module.exports = AuthorizationChecker;
