const AuthenticationProviderInterface = Jymfony.Component.Security.Authentication.Provider.AuthenticationProviderInterface;
const AnonymousToken = Jymfony.Component.Security.Authentication.Token.AnonymousToken;
const AuthenticationException = Jymfony.Component.Security.Exception.AuthenticationException;
const BadCredentialsException = Jymfony.Component.Security.Exception.BadCredentialsException;

/**
 * @memberOf Jymfony.Component.Security.Authentication.Provider
 */
class AnonymousAuthenticationProvider extends implementationOf(AuthenticationProviderInterface) {
    /**
     * Constructor.
     *
     * @param {string} secret
     */
    __construct(secret) {
        /**
         * Used to determine if the token is created by the application
         * instead of a malicious client.
         *
         * @type {string}
         *
         * @private
         */
        this._secret = secret;
    }

    /**
     * @inheritdoc
     */
    authenticate(token) {
        if (! this.supports(token)) {
            throw new AuthenticationException('The token is not supported by this authentication provider.');
        }

        if (this._secret !== token.secret) {
            throw new BadCredentialsException('The Token does not contain the expected key.');
        }

        return token;
    }

    /**
     * @inheritdoc
     */
    supports(token) {
        return token instanceof AnonymousToken;
    }
}

module.exports = AnonymousAuthenticationProvider;
