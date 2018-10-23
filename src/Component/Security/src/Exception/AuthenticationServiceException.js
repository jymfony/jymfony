const AuthenticationException = Jymfony.Component.Security.Exception.AuthenticationException;

/**
 * AuthenticationServiceException is thrown when an authentication request could not be processed due to a system problem.
 *
 * @memberOf Jymfony.Component.Security.Exception
 */
class AuthenticationServiceException extends AuthenticationException {
    /**
     * @inheritdoc
     */
    get messageKey() {
        return 'Authentication request could not be processed due to a system problem.';
    }
}

module.exports = AuthenticationServiceException;
