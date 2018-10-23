const AbstractToken = Jymfony.Component.Security.Authentication.Token.AbstractToken;

/**
 * UsernamePasswordToken implements a username and password token.
 *
 * @memberOf Jymfony.Component.Security.Authentication.Token
 */
class UsernamePasswordToken extends AbstractToken {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Security.User.UserInterface} user
     * @param {*} credentials
     * @param {string} providerKey
     * @param {string[]|Jymfony.Component.Security.Role.Role[]} [roles = []]
     */
    __construct(user, credentials, providerKey, roles = []) {
        super.__construct(roles);

        if (! providerKey) {
            throw new InvalidArgumentException('providerKey must not be empty');
        }

        this.user = user;

        /**
         * @type {*}
         *
         * @private
         */
        this._credentials = credentials;

        /**
         * @type {string}
         *
         * @private
         */
        this._providerKey = providerKey;

        super.authenticated = 0 < roles.length;
    }

    /**
     * @inheritdoc
     */
    get authenticated() {
        return super.authenticated;
    }

    /**
     * @inheritdoc
     */
    set authenticated(isAuthenticated) {
        if (isAuthenticated) {
            throw new LogicException('Cannot set this token to trusted after its instantiation');
        }

        super.authenticated = false;
    }

    /**
     * @inheritdoc
     */
    get credentials() {
        return this._credentials;
    }

    /**
     * Gets the provider key.
     *
     * @returns {string}
     */
    get providerKey() {
        return this._providerKey;
    }

    /**
     * @inheritdoc
     */
    eraseCredentials() {
        super.eraseCredentials();

        this._credentials = undefined;
    }

    /**
     * @inheritdoc
     */
    __sleep() {
        const fields = super.__sleep();
        fields.push('_credentials', '_providerKey');

        return fields;
    }
}

module.exports = UsernamePasswordToken;
