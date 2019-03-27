declare namespace Jymfony.Component.Security.Exception {
    /**
     * Thrown when an authentication is rejected because no Token is available.
     */
    export class AuthenticationCredentialsNotFoundException extends AuthenticationException {
        /**
         * @inheritdoc
         */
        public readonly messageKey: string;
    }
}
