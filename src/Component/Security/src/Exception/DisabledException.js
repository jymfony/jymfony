const AccountStatusException = Jymfony.Component.Security.Exception.AccountStatusException;

/**
 * Thrown if the user account is disabled.
 *
 * @memberOf Jymfony.Component.Security.Exception
 */
export default class DisabledException extends AccountStatusException {
    /**
     * @inheritdoc
     */
    get messageKey() {
        return 'Account is disabled.';
    }
}
