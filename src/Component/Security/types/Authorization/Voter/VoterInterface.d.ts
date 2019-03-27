declare namespace Jymfony.Component.Security.Authorization.Voter {
    import TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;

    export class VoterInterface {
        public static readonly ACCESS_GRANTED = 1;
        public static readonly ACCESS_ABSTAIN = 0;
        public static readonly ACCESS_DENIED = -1;

        /**
         * Returns the vote for the given parameters.
         *
         * This method must return one of the following constants:
         * ACCESS_GRANTED, ACCESS_DENIED, or ACCESS_ABSTAIN.
         *
         * @param token A TokenInterface instance
         * @param subject    The subject to secure
         * @param attributes An array of attributes associated with the method being invoked
         *
         * @returns either ACCESS_GRANTED, ACCESS_ABSTAIN, or ACCESS_DENIED
         */
        vote(token: TokenInterface, subject: any, attributes: Record<string, any>): number;
    }
}
