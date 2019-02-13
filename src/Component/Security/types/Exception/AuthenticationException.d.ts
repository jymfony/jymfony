declare namespace Jymfony.Component.Security.Exception {
    import TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;

    /**
     * Represents an exception thrown on authentication processing.
     */
    export class AuthenticationException extends RuntimeException {
        /**
         * Gets/sets the authentication token for the current exception.
         */
        public token: TokenInterface;

        /**
         * Gets the name of properties to be serialized.
         */
        __sleep(): string[];

        /**
         * Wakeup from de-serialization.
         */
        __wakeup(): void;

        /**
         * Message key to be used by the translation component.
         */
        public readonly messageKey: string;

        /**
         * Message data to be used by the translation component.
         */
        public readonly messageData: Record<string, string>;
    }
}
