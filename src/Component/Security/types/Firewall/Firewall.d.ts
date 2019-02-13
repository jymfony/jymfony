declare namespace Jymfony.Component.Security.Firewall {
    import EventSubscriberInterface = Jymfony.Component.EventDispatcher.EventSubscriberInterface;
    import EventSubscriptions = Jymfony.Component.EventDispatcher.EventSubscriptions;
    import TargetPathTrait = Jymfony.Component.Security.Http.TargetPathTrait;
    import TokenStorageInterface = Jymfony.Component.Security.Authentication.Token.Storage.TokenStorageInterface;
    import AuthenticationTrustResolverInterface = Jymfony.Component.Security.Authentication.AuthenticationTrustResolverInterface;
    import LoggerInterface = Jymfony.Component.Logger.LoggerInterface;
    import Request = Jymfony.Component.HttpFoundation.Request;
    import GetResponseEvent = Jymfony.Component.HttpServer.Event.GetResponseEvent;
    import GetResponseForExceptionEvent = Jymfony.Component.HttpServer.Event.GetResponseForExceptionEvent;
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

        onRequest(event: GetResponseEvent): Promise<void>;

        onException(event: GetResponseForExceptionEvent): Promise<void>;

        /**
         * Handles an AuthenticationException.
         */
        protected _handleAuthenticationException(event: GetResponseForExceptionEvent, config: FirewallConfig, exception: AuthenticationException): Promise<void>;

        /**
         * Handles a logout exception.
         */
        protected _handleLogoutException(event: GetResponseForExceptionEvent, exception: LogoutException): Promise<void>;

        /**
         * Handles a logout request.
         */
        protected _handleLogout(event: GetResponseEvent, config: FirewallConfig): Promise<void>;

        /**
         * Handles an access denied exception.
         */
        private _handleAccessDeniedException(event: GetResponseForExceptionEvent, firewall: FirewallConfig, exception: AccessDeniedException): Promise<void>;

        private _startAuthentication(request: Request, firewall: FirewallConfig, authException: InsufficientAuthenticationException): Response;

        /**
         * @inheritdoc
         */
        static getSubscribedEvents(): EventSubscriptions;
    }
}
