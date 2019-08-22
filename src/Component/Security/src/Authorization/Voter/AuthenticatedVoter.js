const VoterInterface = Jymfony.Component.Security.Authorization.Voter.VoterInterface;

/**
 * AuthenticatedVoter votes if an attribute like IS_AUTHENTICATED_FULLY,
 * IS_AUTHENTICATED_REMEMBERED, or IS_AUTHENTICATED_ANONYMOUSLY is present.
 *
 * This list is most restrictive to least restrictive checking.
 *
 * @memberOf Jymfony.Component.Security.Authorization.Voter
 */
export default class AuthenticatedVoter extends implementationOf(VoterInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Security.Authentication.AuthenticationTrustResolverInterface} authenticationTrustResolver
     */
    __construct(authenticationTrustResolver) {
        /**
         * @type {Jymfony.Component.Security.Authentication.AuthenticationTrustResolverInterface}
         *
         * @private
         */
        this._authenticationTrustResolver = authenticationTrustResolver;
    }

    /**
     * @inheritdoc
     */
    vote(token, subject, attributes) {
        let result = VoterInterface.ACCESS_ABSTAIN;
        for (const attribute of Object.values(attributes)) {
            if (null === attribute || undefined === attribute ||
                (__self.IS_AUTHENTICATED_FULLY !== attribute
                    && __self.IS_AUTHENTICATED_REMEMBERED !== attribute
                    && __self.IS_AUTHENTICATED_ANONYMOUSLY !== attribute)) {
                continue;
            }

            result = VoterInterface.ACCESS_DENIED;

            if (__self.IS_AUTHENTICATED_FULLY === attribute
                && this._authenticationTrustResolver.isFullFledged(token)) {
                return VoterInterface.ACCESS_GRANTED;
            }

            if (__self.IS_AUTHENTICATED_REMEMBERED === attribute
                && (this._authenticationTrustResolver.isRememberMe(token)
                    || this._authenticationTrustResolver.isFullFledged(token))) {
                return VoterInterface.ACCESS_GRANTED;
            }

            if (__self.IS_AUTHENTICATED_ANONYMOUSLY === attribute
                && (this._authenticationTrustResolver.isAnonymous(token)
                    || this._authenticationTrustResolver.isRememberMe(token)
                    || this._authenticationTrustResolver.isFullFledged(token))) {
                return VoterInterface.ACCESS_GRANTED;
            }
        }

        return result;
    }
}

AuthenticatedVoter.IS_AUTHENTICATED_FULLY = 'IS_AUTHENTICATED_FULLY';
AuthenticatedVoter.IS_AUTHENTICATED_REMEMBERED = 'IS_AUTHENTICATED_REMEMBERED';
AuthenticatedVoter.IS_AUTHENTICATED_ANONYMOUSLY = 'IS_AUTHENTICATED_ANONYMOUSLY';
