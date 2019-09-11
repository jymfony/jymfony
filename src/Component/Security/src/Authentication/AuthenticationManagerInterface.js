/**
 * AuthenticationManagerInterface is the interface for authentication managers,
 * which process Token authentication.
 *
 * @memberOf Jymfony.Component.Security.Authentication
 */
class AuthenticationManagerInterface {
    /**
     * Attempts to authenticate a TokenInterface object.
     *
     * @param {Jymfony.Component.Security.Authentication.Token.TokenInterface} token The TokenInterface instance to authenticate
     *
     * @returns {Promise<Jymfony.Component.Security.Authentication.Token.TokenInterface>} An authenticated TokenInterface instance, never null
     *
     * @throws {Jymfony.Component.Security.Exception.AuthenticationException} if the authentication fails
     */
    async authenticate(token) { }
}

export default getInterface(AuthenticationManagerInterface);
