declare namespace Jymfony.Component.Security.Authorization.Voter {
    import AuthenticationTrustResolverInterface = Jymfony.Component.Security.Authentication.AuthenticationTrustResolverInterface;
    import TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;

    /**
     * AuthenticatedVoter votes if an attribute like IS_AUTHENTICATED_FULLY,
     * IS_AUTHENTICATED_REMEMBERED, or IS_AUTHENTICATED_ANONYMOUSLY is present.
     *
     * This list is most restrictive to least restrictive checking.
     */
    export class AuthenticatedVoter extends implementationOf(VoterInterface) {
        public static readonly IS_AUTHENTICATED_FULLY = 'IS_AUTHENTICATED_FULLY';
        public static readonly IS_AUTHENTICATED_REMEMBERED = 'IS_AUTHENTICATED_REMEMBERED';
        public static readonly IS_AUTHENTICATED_ANONYMOUSLY = 'IS_AUTHENTICATED_ANONYMOUSLY';

        private _authenticationTrustResolver: AuthenticationTrustResolverInterface;

        /**
         * Constructor.
         */
        __construct(authenticationTrustResolver: AuthenticationTrustResolverInterface): void;
        constructor(authenticationTrustResolver: AuthenticationTrustResolverInterface);

        /**
         * @inheritdoc
         */
        vote(token: TokenInterface, subject: any, attributes: Record<string, any>): number;
    }
}
