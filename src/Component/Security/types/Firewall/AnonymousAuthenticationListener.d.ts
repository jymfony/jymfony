declare namespace Jymfony.Component.Security.Firewall {
    import TokenStorageInterface = Jymfony.Component.Security.Authentication.Token.Storage.TokenStorageInterface;
    import LoggerInterface = Jymfony.Component.Logger.LoggerInterface;
    import AuthenticationManagerInterface = Jymfony.Component.Security.Authentication.AuthenticationManagerInterface;
    import GetResponseEvent = Jymfony.Component.HttpServer.Event.GetResponseEvent;

    /**
     * AnonymousAuthenticationListener automatically adds a Token if none is
     * already present.
     */
    export class AnonymousAuthenticationListener extends implementationOf(ListenerInterface) {
        private _tokenStorage: TokenStorageInterface;
        private _secret: string;
        private _logger: LoggerInterface;
        private _authenticationManager: AuthenticationManagerInterface;

        /**
         * Constructor.
         */
        __construct(tokenStorage: TokenStorageInterface, secret: string, logger?: LoggerInterface, authenticationManager?: AuthenticationManagerInterface): void;
        constructor(tokenStorage: TokenStorageInterface, secret: string, logger?: LoggerInterface, authenticationManager?: AuthenticationManagerInterface);

        handle(event: GetResponseEvent): Promise<void>;
    }
}
