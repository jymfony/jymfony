declare namespace Jymfony.Component.Security.Authentication {
    import TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;

    /**
     * Resolves the authentication status of a given token.
     */
    export class AuthenticationTrustResolverInterface {
        public static readonly definition: Newable<AuthenticationTrustResolverInterface>;

        /**
         * Resolves whether the passed token implementation is authenticated
         * anonymously.
         *
         * If null is passed, the method must return false.
         */
        isAnonymous(token?: TokenInterface): boolean;

        /**
         * Resolves whether the passed token implementation is authenticated
         * using remember-me capabilities.
         */
        isRememberMe(token?: TokenInterface): boolean;

        /**
         * Resolves whether the passed token implementation is fully authenticated.
         */
        isFullFledged(token?: TokenInterface): boolean;
    }
}
