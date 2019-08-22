/**
 * Resolves the authentication status of a given token.
 *
 * @memberOf Jymfony.Component.Security.Authentication
 */
class AuthenticationTrustResolverInterface {
    /**
     * Resolves whether the passed token implementation is authenticated
     * anonymously.
     *
     * If null is passed, the method must return false.
     *
     * @param {Jymfony.Component.Security.Authentication.Token.TokenInterface} [token = null]
     *
     * @returns {boolean}
     */
    isAnonymous(token = null) { }

    /**
     * Resolves whether the passed token implementation is authenticated
     * using remember-me capabilities.
     *
     * @param {Jymfony.Component.Security.Authentication.Token.TokenInterface} [token = null]
     *
     * @returns {boolean}
     */
    isRememberMe(token = null) { }

    /**
     * Resolves whether the passed token implementation is fully authenticated.
     *
     * @param {Jymfony.Component.Security.Authentication.Token.TokenInterface} [token = null]
     *
     * @returns {boolean}
     */
    isFullFledged(token = null) { }
}

export default getInterface(AuthenticationTrustResolverInterface);
