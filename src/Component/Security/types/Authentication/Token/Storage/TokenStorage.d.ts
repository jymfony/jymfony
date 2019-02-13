declare namespace Jymfony.Component.Security.Authentication.Token.Storage {
    import Request = Jymfony.Component.HttpFoundation.Request;
    import TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;

    /**
     * TokenStorage contains TokenInterfaces.
     * It gives access to the token representing the user authentications.
     */
    export class TokenStorage extends implementationOf(TokenStorageInterface) {
        private _map: WeakMap<Request, TokenInterface>;

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        /**
         * @inheritdoc
         */
        getToken(request: Request): TokenInterface | undefined;

        /**
         * @inheritdoc
         */
        setToken(request: Request, token: TokenInterface): void;
    }
}
