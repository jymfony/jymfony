const AccountStatusException = Jymfony.Component.Security.Exception.AccountStatusException;

/**
 * Thrown if the user account has expired.
 *
 * @memberOf Jymfony.Component.Security.Exception
 */
export default class AccountExpiredException extends AccountStatusException {
    /**
     * @inheritdoc
     */
    get messageKey() {
        return 'Account has expired.';
    }
}
