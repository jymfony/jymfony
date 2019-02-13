declare namespace Jymfony.Component.Security.Exception {
    /**
     * ProviderNotFoundException is thrown when no AuthenticationProviderInterface instance
     * supports an authentication Token.
     */
    export class ProviderNotFoundException extends AuthenticationException {
        /**
         * @inheritdoc
         */
        public readonly messageKey: string;
    }
}
