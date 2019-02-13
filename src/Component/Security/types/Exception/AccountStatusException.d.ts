declare namespace Jymfony.Component.Security.Exception {
    import UserInterface = Jymfony.Component.Security.User.UserInterface;

    /**
     * AccountStatusException is the base class for authentication exceptions
     * caused by the user account status.
     */
    export class AccountStatusException extends AuthenticationException {
        private _user: UserInterface;

        /**
         * Gets/sets the user.
         */
        public user: UserInterface;

        /**
         * @inheritdoc
         */
        __sleep(): string[];
    }
}
