declare namespace Jymfony.Component.Security.Firewall {
    import EventSubscriberInterface = Jymfony.Component.EventDispatcher.EventSubscriberInterface;
    import TokenStorageInterface = Jymfony.Component.Security.Authentication.Token.Storage.TokenStorageInterface;
    import AuthenticationTrustResolverInterface = Jymfony.Component.Security.Authentication.AuthenticationTrustResolverInterface;
    import LoggerInterface = Jymfony.Component.Logger.LoggerInterface;
    import GetResponseEvent = Jymfony.Component.HttpServer.Event.GetResponseEvent;
    import FilterResponseEvent = Jymfony.Component.HttpServer.Event.FilterResponseEvent;
    import EventSubscriptions = Jymfony.Component.EventDispatcher.EventSubscriptions;
    import TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;
    import UserProviderInterface = Jymfony.Component.Security.User.UserProviderInterface;

    /**
     * ContextListener manages the SecurityContext persistence through a session.
     */
    export class ContextListener extends implementationOf(ListenerInterface, EventSubscriberInterface) {
        private _tokenStorage: TokenStorageInterface;
        private _providers: UserProviderInterface[];
        private _authenticationTrustResolver: AuthenticationTrustResolverInterface;
        private _sessionKey: string;
        private _logger: LoggerInterface;

        /**
         * Constructor.
         */
        __construct(tokenStorage: TokenStorageInterface, userProviders: UserProviderInterface[], authenticationTrustResolver: AuthenticationTrustResolverInterface, sessionKey: string, logger?: LoggerInterface): void;
        constructor(tokenStorage: TokenStorageInterface, userProviders: UserProviderInterface[], authenticationTrustResolver: AuthenticationTrustResolverInterface, sessionKey: string, logger?: LoggerInterface);

        handle(event: GetResponseEvent): Promise<void>;

        onResponse(event: FilterResponseEvent): void;

        /**
         * @inheritdoc
         */
        static getSubscribedEvents(): EventSubscriptions;

        /**
         * Tries to refresh the user from the authentication provider.
         *
         * @protected
         */
        protected _refreshUser(token: TokenInterface): Promise<TokenInterface>;
    }
}
