const Role = Jymfony.Component.Security.Role.Role;

/**
 * SwitchUserRole is used when the current user temporarily impersonates
 * another one.
 *
 * @memberOf Jymfony.Component.Security.Role
 */
class SwitchUserRole extends Role {
    /**
     * Constructor.
     *
     * @param {string} role
     * @param {Jymfony.Component.Security.Authentication.Token.TokenInterface} token
     */
    __construct(role, token) {
        /**
         * @type {Jymfony.Component.Security.Authentication.Token.TokenInterface}
         *
         * @private
         */
        this._source = token;

        super.__construct(role);
    }

    /**
     * Gets the source token.
     *
     * @returns {Jymfony.Component.Security.Authentication.Token.TokenInterface}
     */
    get source() {
        return this._source;
    }
}

module.exports = SwitchUserRole;
