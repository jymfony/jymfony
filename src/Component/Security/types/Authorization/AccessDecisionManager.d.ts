declare namespace Jymfony.Component.Security.Authorization {
    import VoterInterface = Jymfony.Component.Security.Authorization.Voter.VoterInterface;
    import TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;

    /**
     * AccessDecisionManager is the base class for all access decision managers
     * that use decision voters.
     */
    export class AccessDecisionManager extends implementationOf(AccessDecisionManagerInterface) {
        public static readonly STRATEGY_AFFIRMATIVE = 'affirmative';
        public static readonly STRATEGY_CONSENSUS = 'consensus';
        public static readonly STRATEGY_UNANIMOUS = 'unanimous';

        private _decide: string;
        private _voters: VoterInterface[];
        private _allowIfAllAbstainDecisions: boolean;
        private _allowIfEqualGrantedDeniedDecisions: boolean;

        /**
         * Constructor.
         */
        __construct(voters?: VoterInterface[], strategy?: string, allowIfAllAbstainDecisions?: boolean, allowIfEqualGrantedDeniedDecisions?: boolean): void;
        constructor(voters?: VoterInterface[], strategy?: string, allowIfAllAbstainDecisions?: boolean, allowIfEqualGrantedDeniedDecisions?: boolean);

        /**
         * @inheritdoc
         */
        decide(token: TokenInterface, attributes: Record<string, any>, object?: any): boolean;

        /**
         * Grants access if any voter returns an affirmative response.
         *
         * If all voters abstained from voting, the decision will be based on the
         * allowIfAllAbstainDecisions property value (defaults to false).
         */
        private _decideAffirmative(token: TokenInterface, attributes: Record<string, any>, object?: any): boolean;

        /**
         * Grants access if there is consensus of granted against denied responses.
         *
         * Consensus means majority-rule (ignoring abstains) rather than unanimous
         * agreement (ignoring abstains). If you require unanimity, see
         * UnanimousBased.
         *
         * If there were an equal number of grant and deny votes, the decision will
         * be based on the allowIfEqualGrantedDeniedDecisions property value
         * (defaults to true).
         *
         * If all voters abstained from voting, the decision will be based on the
         * allowIfAllAbstainDecisions property value (defaults to false).
         */
        _decideConsensus(token: TokenInterface, attributes: Record<string, any>, object?: any): boolean;

        /**
         * Grants access if only grant (or abstain) votes were received.
         *
         * If all voters abstained from voting, the decision will be based on the
         * allowIfAllAbstainDecisions property value (defaults to false).
         */
        _decideUnanimous(token: TokenInterface, attributes: Record<string, any>, object?: any): boolean;
    }
}
