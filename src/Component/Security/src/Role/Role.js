const cache = {};

/**
 * Represents a user role identified by a string.
 * Role objects are unique for each role identifier.
 *
 * @memberOf Jymfony.Component.Security.Role
 */
export default class Role {
    /**
     * Constructor.
     *
     * @param {string} role
     */
    __construct(role) {
        if (cache.hasOwnProperty(role)) {
            return cache[role];
        }

        cache[role] = this;

        /**
         * The role identifier.
         *
         * @type {string}
         *
         * @private
         */
        this._role = role;

        // Make object immutable.
        Object.freeze(this);
    }

    /**
     * Gets the role identifier.
     *
     * @returns {string}
     */
    get role() {
        return this._role;
    }

    /**
     * Gets the string representation of this role (the identifier).
     *
     * @returns {string}
     */
    toString() {
        return this._role;
    }
}
