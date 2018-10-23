/**
 * TokenInterface is the interface for the user authentication information.
 *
 * @memberOf Jymfony.Component.Security.Authentication.Token
 */
class TokenInterface {
    /**
     * Gets a string representation of the Token.
     * This is only to be used for debugging purposes.
     *
     * @returns {string}
     */
    toString() { }

    /**
     * Gets the user roles.
     *
     * @returns {Jymfony.Component.Security.Role.Role[]}
     */
    get roles() { }

    /**
     * Gets the user presented credentials or null.
     *
     * @returns {*} The user credentials
     */
    get credentials() { }

    /**
     * Gets the user, if any.
     *
     * @returns {null|Jymfony.Component.Security.User.UserInterface}
     */
    get user() { }

    /**
     * Sets (or unset) a user.
     *
     * @param {null|Jymfony.Component.Security.User.UserInterface} user
     */
    set user(user) { }

    /**
     * Get the username.
     *
     * @returns {string}
     */
    get username() { }

    /**
     * Whether the user is authenticated or not.
     *
     * @returns {boolean} true if the token has been authenticated, false otherwise
     */
    get authenticated() { }

    /**
     * Sets the authenticated flag.
     *
     * @param {boolean} isAuthenticated The authenticated flag
     */
    set authenticated(isAuthenticated) { }

    /**
     * Removes sensitive information from the token.
     */
    eraseCredentials() { }

    /**
     * Returns the token attributes.
     *
     * @returns {Array}
     */
    get attributes() { }

    /**
     * Sets the token attributes.
     *
     * @param {Array} attributes The token attributes
     */
    set attributes(attributes) { }

    /**
     * Checks whether the given attribute exists.
     *
     * @param {string} name The attribute name
     *
     * @returns {boolean} true if the attribute exists, false otherwise
     */
    hasAttribute(name) { }

    /**
     * Gets an attribute value.
     *
     * @param {string} name The attribute name
     *
     * @returns {*} The attribute value
     *
     * @throws {InvalidArgumentException} When attribute doesn't exist for this token
     */
    getAttribute(name) { }

    /**
     * Sets an attribute.
     *
     * @param {string} name The attribute name
     * @param {*} value The attribute value
     */
    setAttribute(name, value) { }
}

module.exports = getInterface(TokenInterface);
