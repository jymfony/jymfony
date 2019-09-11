const AuthenticationException = Jymfony.Component.Security.Exception.AuthenticationException;

/**
 * Thrown when an authentication is rejected because no Token is available.
 *
 * @memberOf Jymfony.Component.Security.Exception
 */
export default class AuthenticationCredentialsNotFoundException extends AuthenticationException {
    /**
     * @inheritdoc
     */
    get messageKey() {
        return 'Authentication credentials could not be found.';
    }
}
