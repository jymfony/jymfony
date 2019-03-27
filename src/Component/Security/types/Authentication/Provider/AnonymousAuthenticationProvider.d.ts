declare namespace Jymfony.Component.Security.Authentication.Provider {
    import TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;
    import AnonymousToken = Jymfony.Component.Security.Authentication.Token.AnonymousToken;

    export class AnonymousAuthenticationProvider extends implementationOf(AuthenticationProviderInterface) {
        /**
         * Used to determine if the token is created by the application
         * instead of a malicious client.
         */
        private _secret: string;

        /**
         * Constructor.
         */
        __construct(secret: string): void;
        constructor(secret: string);

        /**
         * @inheritdoc
         */
        authenticate(token: TokenInterface): Promise<TokenInterface>;

        /**
         * @inheritdoc
         */
        supports(token: TokenInterface): token is AnonymousToken;
    }
}
