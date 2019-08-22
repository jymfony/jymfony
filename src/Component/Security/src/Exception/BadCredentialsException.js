const AuthenticationException = Jymfony.Component.Security.Exception.AuthenticationException;

/**
 * BadCredentialsException is thrown when the user credentials are invalid.
 *
 * @memberOf Jymfony.Component.Security.Exception
 */
export default class BadCredentialsException extends AuthenticationException {
    /**
     * @inheritdoc
     */
    get messageKey() {
        return 'Invalid credentials.';
    }
}
