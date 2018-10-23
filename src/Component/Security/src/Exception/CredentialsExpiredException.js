const AccountStatusException = Jymfony.Component.Security.Exception.AccountStatusException;

/**
 * Thrown if the user account credentials have expired.
 *
 * @memberOf Jymfony.Component.Security.Exception
 */
class CredentialsExpiredException extends AccountStatusException {
    /**
     * @inheritdoc
     */
    get messageKey() {
        return 'Credentials have expired.';
    }
}

module.exports = CredentialsExpiredException;
