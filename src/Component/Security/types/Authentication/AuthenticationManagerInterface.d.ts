declare namespace Jymfony.Component.Security.Authentication {
    import TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;

    /**
     * AuthenticationManagerInterface is the interface for authentication managers,
     * which process Token authentication.
     */
    export class AuthenticationManagerInterface implements MixinInterface {
        public static readonly definition: Newable<AuthenticationManagerInterface>;

        /**
         * Attempts to authenticate a TokenInterface object.
         *
         * @param token The TokenInterface instance to authenticate
         *
         * @returns An authenticated TokenInterface instance, never null
         *
         * @throws {Jymfony.Component.Security.Exception.AuthenticationException} if the authentication fails
         */
        authenticate(token: TokenInterface): Promise<TokenInterface>;
    }
}
