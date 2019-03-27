declare namespace Jymfony.Component.Security.Firewall {
    import UserCheckerInterface = Jymfony.Component.Security.User.UserCheckerInterface;
    import RequestMatcherInterface = Jymfony.Component.HttpFoundation.RequestMatcherInterface;
    import UserProviderInterface = Jymfony.Component.Security.User.UserProviderInterface;
    import EntryPointInterface = Jymfony.Component.Security.Authentication.EntryPoint.EntryPointInterface;
    import AccessDeniedHandlerInterface = Jymfony.Component.Security.Authorization.AccessDeniedHandlerInterface;

    export class FirewallConfig {
        private _name: string;
        private _enabled: boolean;
        private _userChecker: UserCheckerInterface;
        private _requestMatcher: RequestMatcherInterface;
        private _stateless: boolean;
        private _userProvider: UserProviderInterface;
        private _entryPoint: EntryPointInterface;
        private _accessDeniedHandler: AccessDeniedHandlerInterface;
        private _authenticationListeners: ListenerInterface[];
        private _logoutHandler: ListenerInterface;

        /**
         * Constructor.
         */
        __construct(name?: string, enabled?: boolean, userChecker?: UserCheckerInterface, requestMatcher?: RequestMatcherInterface, stateless?: boolean, userProvider?: UserProviderInterface, entryPoint?: EntryPointInterface, accessDeniedHandler?: AccessDeniedHandlerInterface, authenticationListeners?: ListenerInterface[], logoutHandler?: ListenerInterface): void;
        constructor(name?: string, enabled?: boolean, userChecker?: UserCheckerInterface, requestMatcher?: RequestMatcherInterface, stateless?: boolean, userProvider?: UserProviderInterface, entryPoint?: EntryPointInterface, accessDeniedHandler?: AccessDeniedHandlerInterface, authenticationListeners?: ListenerInterface[], logoutHandler?: ListenerInterface);

        /**
         * Gets the firewall name.
         */
        public readonly name: string;

        /**
         * Whether the security is enabled or not on this firewall.
         */
        public readonly enabled: boolean;

        /**
         * Gets the user checker, if set.
         */
        public readonly userChecker: UserCheckerInterface | undefined;

        /**
         * Gets the request matcher for the current firewall.
         */
        public readonly requestMatcher: RequestMatcherInterface;

        /**
         * Whether this firewall preserves session state or not.
         */
        public readonly stateless: boolean;

        /**
         * Gets the user provider, if set.
         */
        public readonly userProvider: UserProviderInterface | undefined;

        /**
         * Gets the authentication entry point.
         */
        public readonly entryPoint: EntryPointInterface;

        /**
         * Gets the access denied handler.
         */
        public readonly accessDeniedHandler: AccessDeniedHandlerInterface;

        /**
         * Gets a copy of the authentication listener array.
         */
        public readonly authenticationListeners: ListenerInterface[];

        /**
         * Gets the logout handler.
         */
        public readonly logoutHandler: ListenerInterface;
    }
}
