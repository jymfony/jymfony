const TokenStorageInterface = Jymfony.Component.Security.Authentication.Token.Storage.TokenStorageInterface;

/**
 * TokenStorage contains TokenInterfaces.
 * It gives access to the token representing the user authentications.
 *
 * @memberOf Jymfony.Component.Security.Authentication.Token.Storage
 */
class TokenStorage extends implementationOf(TokenStorageInterface) {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * @type {WeakMap<Jymfony.Component.HttpFoundation.Request, Jymfony.Component.Security.Authentication.Token.TokenInterface>}
         *
         * @private
         */
        this._map = new WeakMap();
    }

    /**
     * @inheritdoc
     */
    getToken(request) {
        return this._map.get(request);
    }

    /**
     * @inheritdoc
     */
    setToken(request, token) {
        this._map.set(request, token);
    }
}

module.exports = TokenStorage;
