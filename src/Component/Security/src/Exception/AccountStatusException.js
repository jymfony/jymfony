const AuthenticationException = Jymfony.Component.Security.Exception.AuthenticationException;

/**
 * AccountStatusException is the base class for authentication exceptions
 * caused by the user account status.
 *
 * @memberOf Jymfony.Component.Security.Exception
 */
export default class AccountStatusException extends AuthenticationException {
    /**
     * Gets the user.
     *
     * @returns {Jymfony.Component.Security.User.UserInterface}
     */
    get user() {
        return this._user;
    }

    /**
     * Sets the user.
     *
     * @param {Jymfony.Component.Security.User.UserInterface} user
     */
    set user(user) {
        this._user = user;
    }

    /**
     * @inheritdoc
     */
    __sleep() {
        const parent = super.__sleep();
        parent.push('_user');

        return parent;
    }
}
