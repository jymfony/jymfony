declare namespace Jymfony.Component.Security.User {
    /**
     * Represents a class that loads UserInterface objects from some source for the authentication system.
     *
     * In a typical authentication configuration, a username (i.e. some unique
     * user identifier) credential enters the system (via form login, or any
     * method). The user provider that is configured with that authentication
     * method is asked to load the UserInterface object for the given username
     * (via loadUserByUsername) so that the rest of the process can continue.
     *
     * Internally, a user provider can load users from any source (databases,
     * configuration, web service). This is totally independent of how the authentication
     * information is submitted or what the UserInterface object looks like.
     *
     * @see {Jymfony.Component.Security.User.UserInterface}
     */
    export class UserProviderInterface {
        public static readonly definition: Newable<UserProviderInterface>;

        /**
         * Loads the user for the given username.
         *
         * This method must throw UsernameNotFoundException if the user is not
         * found.
         *
         * @throws {Jymfony.Component.Security.Exception.UsernameNotFoundException} if the user is not found
         */
        loadUserByUsername(username: string): Promise<UserInterface>;

        /**
         * Refreshes the user.
         *
         * It is up to the implementation to decide if the user data should be
         * totally reloaded (e.g. from the database), or if the UserInterface
         * object can just be merged into some internal array of users / identity
         * map.
         *
         * @throws {Jymfony.Component.Security.Exception.UnsupportedUserException} if the user is not supported
         * @throws {Jymfony.Component.Security.Exception.UsernameNotFoundException} if the user is not found
         */
        refreshUser(user: UserInterface): Promise<UserInterface>;

        /**
         * Whether this provider supports the given user class.
         */
        supportsClass(class_: string | Newable<any>): boolean;
    }
}
