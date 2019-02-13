declare namespace Jymfony.Component.Security.Authentication {
    import AuthenticationProviderInterface = Jymfony.Component.Security.Authentication.Provider.AuthenticationProviderInterface;
    import EventDispatcherInterface = Jymfony.Component.EventDispatcher.EventDispatcherInterface;
    import TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;

    /**
     * AuthenticationProviderManager uses a list of AuthenticationProviderInterface
     * instances to authenticate a Token.
     */
    export class AuthenticationProviderManager extends implementationOf(AuthenticationManagerInterface) {
        private _providers: AuthenticationProviderInterface[];
        private _eraseCredentials: boolean;
        private _eventDispatcher: EventDispatcherInterface | undefined;

        /**
         * Constructor.
         *
         * @param providers An iterable with AuthenticationProviderInterface instances as values
         * @param [eraseCredentials = true] Whether to erase credentials after authentication or not
         *
         * @throws {InvalidArgumentException}
         */
        __construct(providers: AuthenticationProviderInterface[] | IterableIterator<AuthenticationProviderInterface>, eraseCredentials?: boolean): void;
        constructor(providers: AuthenticationProviderInterface[] | IterableIterator<AuthenticationProviderInterface>, eraseCredentials?: boolean);

        /**
         * Inject an event dispatcher.
         */
        setEventDispatcher(dispatcher: EventDispatcherInterface): void;

        /**
         * @inheritdoc
         */
        authenticate(token: TokenInterface): Promise<TokenInterface>;
    }
}
