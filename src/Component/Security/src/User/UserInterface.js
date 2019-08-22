/**
 * The interface that all users classes must implement.
 *
 * This interface is useful because the authentication layer can deal with
 * the object through its lifecycle, using the object to get the encoded
 * password (for checking against a submitted password), assigning roles
 * and so on.
 *
 * Regardless of how your user are loaded or where they come from (a database,
 * configuration, web service, etc), you will have a class that implements
 * this interface. Objects that implement this interface are created and
 * loaded by different objects that implement UserProviderInterface.
 *
 * @memberOf Jymfony.Component.Security.User
 */
class UserInterface {
    /**
     * Returns the roles granted to the user.
     *
     * @returns {Jymfony.Component.Security.Role.Role[]}
     */
    get roles() { }

    /**
     * Returns the password used to authenticate the user.
     *
     * This should be the encoded password. On authentication, a plain-text
     * password should be salted, encoded, and then compared to this value.
     *
     * @returns {string}
     */
    get password() { }

    /**
     * Returns the salt that was originally used to encode the password.
     *
     * This can return null if the password was not encoded using a salt.
     *
     * @returns {string|null}
     */
    get salt() { }

    /**
     * Returns the username used to authenticate the user.
     *
     * @returns {string}
     */
    get username() { }

    /**
     * Removes sensitive data from the user object.
     *
     * This is important if, at any given point, sensitive information like
     * the plain-text password is stored on this object.
     */
    eraseCredentials() { }

    /**
     * Checks whether the user's account has expired.
     *
     * Internally, if this method returns false, the authentication system
     * will throw an AccountExpiredException and prevent login.
     *
     * @returns {boolean} true if the user's account is non expired, false otherwise
     *
     * @see {Jymfony.Component.Security.Exception.AccountExpiredException}
     */
    isAccountNonExpired() { }

    /**
     * Checks whether the user is locked.
     *
     * Internally, if this method returns false, the authentication system
     * will throw a LockedException and prevent login.
     *
     * @returns {boolean} true if the user is not locked, false otherwise
     *
     * @see {Jymfony.Component.Security.Exception.LockedException}
     */
    isAccountNonLocked() { }

    /**
     * Checks whether the user's credentials (password) has expired.
     *
     * Internally, if this method returns false, the authentication system
     * will throw a CredentialsExpiredException and prevent login.
     *
     * @returns {boolean} true if the user's credentials are non expired, false otherwise
     *
     * @see {Jymfony.Component.Security.Exception.CredentialsExpiredException}
     */
    isCredentialsNonExpired() { }

    /**
     * Checks whether the user is enabled.
     *
     * Internally, if this method returns false, the authentication system
     * will throw a DisabledException and prevent login.
     *
     * @returns {boolean} true if the user is enabled, false otherwise
     *
     * @see {Jymfony.Component.Security.Exception.DisabledException}
     */
    isEnabled() { }
}

export default getInterface(UserInterface);
