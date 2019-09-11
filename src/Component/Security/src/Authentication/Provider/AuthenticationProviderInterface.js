const AuthenticationManagerInterface = Jymfony.Component.Security.Authentication.AuthenticationManagerInterface;

/**
 * AuthenticationProviderInterface is the interface for all authentication providers.
 * Concrete implementations processes specific Token instances.
 *
 * @memberOf Jymfony.Component.Security.Authentication.Provider
 */
class AuthenticationProviderInterface extends AuthenticationManagerInterface.definition {
    /**
     * Checks whether this provider supports the given token.
     *
     * @param {Jymfony.Component.Security.Authentication.Token.TokenInterface} token
     *
     * @returns {boolean} true if the implementation supports the Token, false otherwise
     */
    supports(token) { }
}

export default getInterface(AuthenticationProviderInterface);
