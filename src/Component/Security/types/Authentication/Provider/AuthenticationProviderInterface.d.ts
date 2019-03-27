declare namespace Jymfony.Component.Security.Authentication.Provider {
    import TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;

    /**
     * AuthenticationProviderInterface is the interface for all authentication providers.
     * Concrete implementations processes specific Token instances.
     */
    export class AuthenticationProviderInterface extends AuthenticationManagerInterface.definition {
        /**
         * Checks whether this provider supports the given token.
         *
         * @returns true if the implementation supports the Token, false otherwise
         */
        supports(token: TokenInterface): boolean;
    }
}
