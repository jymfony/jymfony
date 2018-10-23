/**
 * TokenStorage contains TokenInterfaces.
 * It gives access to the token representing the user authentications.
 *
 * @memberOf Jymfony.Component.Security.Authentication.Token.Storage
 */
class TokenStorageInterface {
    /**
     * Returns the current security token for the given request.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     *
     * @returns {Jymfony.Component.Security.Authentication.Token.TokenInterface}
     */
    getToken(request) { }

    /**
     * Sets the security token for a request.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     * @param {Jymfony.Component.Security.Authentication.Token.TokenInterface} token
     */
    setToken(request, token) { }
}

module.exports = getInterface(TokenStorageInterface);
