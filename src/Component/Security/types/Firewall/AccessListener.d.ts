declare namespace Jymfony.Component.Security.Firewall {
    import TokenStorageInterface = Jymfony.Component.Security.Authentication.Token.Storage.TokenStorageInterface;
    import AccessDecisionManagerInterface = Jymfony.Component.Security.Authorization.AccessDecisionManagerInterface;
    import AccessMapInterface = Jymfony.Component.Security.Authorization.AccessMapInterface;
    import AuthenticationManagerInterface = Jymfony.Component.Security.Authentication.AuthenticationManagerInterface;
    import RequestEvent = Jymfony.Contracts.HttpServer.Event.RequestEvent;

    /**
     * AccessListener enforces access control rules.
     */
    export class AccessListener extends implementationOf(ListenerInterface) {
        private _tokenStorage: TokenStorageInterface;
        private _accessDecisionManager: AccessDecisionManagerInterface;
        private _accessMap: AccessMapInterface;
        private _authManager: AuthenticationManagerInterface;

        /**
         * Constructor.
         */
        __construct(tokenStorage: TokenStorageInterface, accessDecisionManager: AccessDecisionManagerInterface, accessMap: AccessMapInterface, authenticationManager: AuthenticationManagerInterface): void;
        constructor(tokenStorage: TokenStorageInterface, accessDecisionManager: AccessDecisionManagerInterface, accessMap: AccessMapInterface, authenticationManager: AuthenticationManagerInterface);

        handle(event: RequestEvent): Promise<void>;
    }
}
