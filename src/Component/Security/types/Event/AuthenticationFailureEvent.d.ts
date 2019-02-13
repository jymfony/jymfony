declare namespace Jymfony.Component.Security.Event {
    import TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;
    import AuthenticationException = Jymfony.Component.Security.Exception.AuthenticationException;

    /**
     * Dispatched on authentication failure.
     */
    export class AuthenticationFailureEvent extends AuthenticationEvent {
        private _exception: AuthenticationException;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(token: TokenInterface, exception: AuthenticationException): void;
        constructor(token: TokenInterface, exception: AuthenticationException);

        /**
         * Gets the authentication exception originating this event.
         */
        public readonly authenticationException: AuthenticationException;
    }
}
