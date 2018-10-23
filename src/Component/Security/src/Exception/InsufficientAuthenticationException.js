const AuthenticationException = Jymfony.Component.Security.Exception.AuthenticationException;

/**
 * InsufficientAuthenticationException is thrown if the user credentials are not sufficiently trusted.
 *
 * This is the case when a user is anonymous and the resource to be displayed has an access role.
 *
 * @memberOf Jymfony.Component.Security.Exception
 */
class InsufficientAuthenticationException extends AuthenticationException {
    /**
     * @inheritdoc
     */
    get messageKey() {
        return 'Not privileged to request the resource.';
    }
}

module.exports = InsufficientAuthenticationException;
