declare namespace Jymfony.Component.Security.Event {
    import Event = Jymfony.Component.EventDispatcher.Event;
    import TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;

    /**
     * General purpose authentication event
     */
    export class AuthenticationEvent extends Event {
        private _token: TokenInterface;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(token: TokenInterface): void;
        constructor(token: TokenInterface);

        /**
         * Gets the subject of this event.
         */
        public readonly authenticationToken: TokenInterface;
    }
}
