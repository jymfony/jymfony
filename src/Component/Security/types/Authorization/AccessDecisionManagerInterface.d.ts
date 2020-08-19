declare namespace Jymfony.Component.Security.Authorization {
    import TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;

    /**
     * AccessDecisionManagerInterface makes authorization decisions.
     */
    export class AccessDecisionManagerInterface {
        public static readonly definition: Newable<AccessDecisionManagerInterface>;

        /**
         * Decides whether the access is possible or not.
         *
         * @param token A TokenInterface instance
         * @param attributes An array of attributes associated with the method being invoked
         * @param [object] The object to secure
         *
         * @returns true if the access is granted, false otherwise
         */
        decide(token: TokenInterface, attributes: Record<string, any>, object?: any): boolean;
    }
}
