const AuthenticationException = Jymfony.Component.Security.Exception.AuthenticationException;

/**
 * BadCredentialsException is thrown when the user credentials are invalid.
 *
 * @memberOf Jymfony.Component.Security.Exception
 */
class BadCredentialsException extends AuthenticationException {
    /**
     * @inheritdoc
     */
    get messageKey() {
        return 'Invalid credentials.';
    }
}

module.exports = BadCredentialsException;
