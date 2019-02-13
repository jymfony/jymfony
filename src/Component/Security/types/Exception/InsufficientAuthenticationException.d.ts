declare namespace Jymfony.Component.Security.Exception {
    /**
     * InsufficientAuthenticationException is thrown if the user credentials are not sufficiently trusted.
     *
     * This is the case when a user is anonymous and the resource to be displayed has an access role.
     */
    export class InsufficientAuthenticationException extends AuthenticationException {
        /**
         * @inheritdoc
         */
        public readonly messageKey: string;
    }
}
