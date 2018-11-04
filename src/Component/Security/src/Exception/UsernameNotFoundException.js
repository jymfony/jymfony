const AuthenticationException = Jymfony.Component.Security.Exception.AuthenticationException;

/**
 * UsernameNotFoundException is thrown if a User cannot be found by its username.
 *
 * @memberOf Jymfony.Component.Security.Exception
 */
class UsernameNotFoundException extends AuthenticationException {
    /**
     * @inheritdoc
     */
    get messageKey() {
        return 'Username could not be found.';
    }

    /**
     * Get the username.
     *
     * @returns {string}
     */
    get username() {
        return this._username;
    }

    /**
     * Set the username.
     *
     * @param {string} username
     */
    set username(username) {
        this._username = username;
    }

    /**
     * @inheritdoc
     */
    __sleep() {
        const parent = super.__sleep();
        parent.push('_username');

        return parent;
    }

    /**
     * @inheritdoc
     */
    get messageData() {
        return {
            '{{ username }}': this._username,
        };
    }
}

module.exports = UsernameNotFoundException;
