declare namespace Jymfony.Component.Security.User {
    /**
     * Implement to throw AccountStatusException during the authentication process.
     *
     * Can be used when you want to check the account status, e.g when the account is
     * disabled or blocked. This should not be used to make authentication decisions.
     */
    export class UserCheckerInterface {
        public static readonly definition: Newable<UserCheckerInterface>;

        /**
         * Checks the user account before authentication.
         */
        checkPreAuth(user: UserInterface): void;

        /**
         * Checks the user account after authentication.
         */
        checkPostAuth(user: UserInterface): void;
    }
}
