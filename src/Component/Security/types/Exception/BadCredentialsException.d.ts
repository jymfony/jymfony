declare namespace Jymfony.Component.Security.Exception {
    /**
     * BadCredentialsException is thrown when the user credentials are invalid.
     */
    export class BadCredentialsException extends AuthenticationException {
        /**
         * @inheritdoc
         */
        public readonly messageKey: string;
    }
}
