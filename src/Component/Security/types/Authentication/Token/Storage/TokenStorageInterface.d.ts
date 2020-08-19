declare namespace Jymfony.Component.Security.Authentication.Token.Storage {
    import Request = Jymfony.Component.HttpFoundation.Request;
    import TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;

    /**
     * TokenStorage contains TokenInterfaces.
     * It gives access to the token representing the user authentications.
     */
    export class TokenStorageInterface {
        public static readonly definition: Newable<TokenStorageInterface>;

        /**
         * Returns the current security token for the given request.
         */
        getToken(request: Request): TokenInterface;

        /**
         * Sets the security token for a request.
         */
        setToken(request: Request, token: TokenInterface): void;
    }
}
