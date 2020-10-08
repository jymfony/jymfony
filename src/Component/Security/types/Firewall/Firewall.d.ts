declare namespace Jymfony.Component.Security.Firewall {
    import EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
    import EventSubscriptions = Jymfony.Contracts.EventDispatcher.EventSubscriptions;
    import TargetPathTrait = Jymfony.Component.Security.Http.TargetPathTrait;
    import TokenStorageInterface = Jymfony.Component.Security.Authentication.Token.Storage.TokenStorageInterface;
    import AuthenticationTrustResolverInterface = Jymfony.Component.Security.Authentication.AuthenticationTrustResolverInterface;
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
    import Request = Jymfony.Component.HttpFoundation.Request;
    import RequestEvent = Jymfony.Contracts.HttpServer.Event.RequestEvent;
    import ExceptionEvent = Jymfony.Contracts.HttpServer.Event.ExceptionEvent;
    import AuthenticationException = Jymfony.Component.Security.Exception.AuthenticationException;
    import AccessDeniedException = Jymfony.Component.Security.Exception.AccessDeniedException;
    import InsufficientAuthenticationException = Jymfony.Component.Security.Exception.InsufficientAuthenticationException;
    import Response = Jymfony.Component.HttpFoundation.Response;
    import LogoutException = Jymfony.Component.Security.Exception.LogoutException;

    /**
     * Firewall uses a FirewallMap to register security listeners for the given
     * request.
     *
     * It allows for different security strategies within the same application
     * (a Basic authentication for the /api, and a web based authentication for
     * everything else for instance).
     */
    export class Firewall extends implementationOf(EventSubscriberInterface, TargetPathTrait) {
        private _map: FirewallMapInterface;
        private _tokenStorage: TokenStorageInterface;
        private _authenticationTrustResolver: AuthenticationTrustResolverInterface;
        private _logger: LoggerInterface;
        private _requestMap: WeakMap<Request, any>;

        /**
         * Constructor.
         *
         */
        __construct(map: FirewallMapInterface, tokenStorage: TokenStorageInterface, authenticationTrustResolver: AuthenticationTrustResolverInterface, logger?: LoggerInterface): void;
        constructor(map: FirewallMapInterface, tokenStorage: TokenStorageInterface, authenticationTrustResolver: AuthenticationTrustResolverInterface, logger?: LoggerInterface);

        onRequest(event: RequestEvent): Promise<void>;
        onException(event: ExceptionEvent): Promise<void>;

        /**
         * Handles an AuthenticationException.
         */
        protected _handleAuthenticationException(event: ExceptionEvent, config: FirewallConfig, exception: AuthenticationException): Promise<void>;

        /**
         * Handles a logout exception.
         */
        protected _handleLogoutException(event: ExceptionEvent, exception: LogoutException): Promise<void>;

        /**
         * Handles a logout request.
         */
        protected _handleLogout(event: RequestEvent, config: FirewallConfig): Promise<void>;

        /**
         * Handles an access denied exception.
         */
        private _handleAccessDeniedException(event: ExceptionEvent, firewall: FirewallConfig, exception: AccessDeniedException): Promise<void>;

        private _startAuthentication(request: Request, firewall: FirewallConfig, authException: InsufficientAuthenticationException): Response;

        /**
         * @inheritdoc
         */
        static getSubscribedEvents(): EventSubscriptions;
    }
}
