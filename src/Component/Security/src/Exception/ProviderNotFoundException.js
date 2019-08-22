const AuthenticationException = Jymfony.Component.Security.Exception.AuthenticationException;

/**
 * ProviderNotFoundException is thrown when no AuthenticationProviderInterface instance
 * supports an authentication Token.
 *
 * @memberOf Jymfony.Component.Security.Exception
 */
export default class ProviderNotFoundException extends AuthenticationException {
    /**
     * @inheritdoc
     */
    get messageKey() {
        return 'No authentication provider found to support the authentication token.';
    }
}
