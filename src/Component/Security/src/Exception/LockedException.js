const AccountStatusException = Jymfony.Component.Security.Exception.AccountStatusException;

/**
 * Thrown if the user account is locked.
 *
 * @memberOf Jymfony.Component.Security.Exception
 */
class LockedException extends AccountStatusException {
    /**
     * @inheritdoc
     */
    get messageKey() {
        return 'Account is locked.';
    }
}

module.exports = LockedException;
