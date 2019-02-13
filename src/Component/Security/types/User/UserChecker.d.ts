declare namespace Jymfony.Component.Security.User {
    /**
     * Checks the user account flags.
     */
    export class UserChecker extends implementationOf(UserCheckerInterface) {
        /**
         * @inheritdoc
         */
        checkPreAuth(user: UserInterface): void;

        /**
         * @inheritdoc
         */
        checkPostAuth(user: UserInterface): void;
    }
}
