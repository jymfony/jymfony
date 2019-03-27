declare namespace Jymfony.Component.Security.User {
    import Role = Jymfony.Component.Security.Role.Role;

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
     */
    export class UserInterface {
        /**
         * Returns the roles granted to the user.
         */
        public readonly roles: Role[];

        /**
         * Returns the password used to authenticate the user.
         *
         * This should be the encoded password. On authentication, a plain-text
         * password should be salted, encoded, and then compared to this value.
         */
        public readonly password: string;

        /**
         * Returns the salt that was originally used to encode the password.
         *
         * This can return null if the password was not encoded using a salt.
         */
        public readonly salt: string | null;

        /**
         * Returns the username used to authenticate the user.
         */
        public readonly username: string;

        /**
         * Removes sensitive data from the user object.
         *
         * This is important if, at any given point, sensitive information like
         * the plain-text password is stored on this object.
         */
        eraseCredentials(): void;

        /**
         * Checks whether the user's account has expired.
         *
         * Internally, if this method returns false, the authentication system
         * will throw an AccountExpiredException and prevent login.
         *
         * @returns true if the user's account is non expired, false otherwise
         *
         * @see {Jymfony.Component.Security.Exception.AccountExpiredException}
         */
        isAccountNonExpired(): boolean;

        /**
         * Checks whether the user is locked.
         *
         * Internally, if this method returns false, the authentication system
         * will throw a LockedException and prevent login.
         *
         * @returns true if the user is not locked, false otherwise
         *
         * @see {Jymfony.Component.Security.Exception.LockedException}
         */
        isAccountNonLocked(): boolean;

        /**
         * Checks whether the user's credentials (password) has expired.
         *
         * Internally, if this method returns false, the authentication system
         * will throw a CredentialsExpiredException and prevent login.
         *
         * @returns true if the user's credentials are non expired, false otherwise
         *
         * @see {Jymfony.Component.Security.Exception.CredentialsExpiredException}
         */
        isCredentialsNonExpired(): boolean;

        /**
         * Checks whether the user is enabled.
         *
         * Internally, if this method returns false, the authentication system
         * will throw a DisabledException and prevent login.
         *
         * @returns true if the user is enabled, false otherwise
         *
         * @see {Jymfony.Component.Security.Exception.DisabledException}
         */
        isEnabled(): boolean;
    }
}
