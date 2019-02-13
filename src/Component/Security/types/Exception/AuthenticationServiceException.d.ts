declare namespace Jymfony.Component.Security.Exception {
    /**
     * AuthenticationServiceException is thrown when an authentication request could not be processed due to a system problem.
     */
    export class AuthenticationServiceException extends AuthenticationException {
        /**
         * @inheritdoc
         */
        public readonly messageKey: string;
    }
}
