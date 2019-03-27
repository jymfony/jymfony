declare namespace Jymfony.Component.Security.Authentication {
    import TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;

    /**
     * Default implementation of authentication trust resolver.
     */
    class AuthenticationTrustResolver extends implementationOf(AuthenticationTrustResolverInterface) {
        private _anonymousClass: string;
        private _rememberMeClass: string;

        /**
         * Constructor.
         */
        __construct(anonymousClass: string, rememberMeClass: string): void;
        constructor(anonymousClass: string, rememberMeClass: string);

        /**
         * @inheritdoc
         */
        isAnonymous(token?: TokenInterface): boolean;

        /**
         * @inheritdoc
         */
        isRememberMe(token?: TokenInterface): boolean;

        /**
         * @inheritdoc
         */
        isFullFledged(token?: TokenInterface): boolean;
    }
}
