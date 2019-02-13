declare namespace Jymfony.Component.Security.Exception {
    /**
     * UsernameNotFoundException is thrown if a User cannot be found by its username.
     */
    export class UsernameNotFoundException extends AuthenticationException {
        /**
         * @inheritdoc
         */
        public readonly messageKey: string;

        /**
         * Gets/sets the username.
         */
        public username: string;

        /**
         * @inheritdoc
         */
        __sleep(): string[];

        /**
         * @inheritdoc
         */
        public readonly messageData: Record<string, string>;
    }
}
