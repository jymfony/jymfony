const AccessDecisionManagerInterface = Jymfony.Component.Security.Authorization.AccessDecisionManagerInterface;
const VoterInterface = Jymfony.Component.Security.Authorization.Voter.VoterInterface;

/**
 * AccessDecisionManager is the base class for all access decision managers
 * that use decision voters.
 *
 * @memberOf Jymfony.Component.Security.Authorization
 */
class AccessDecisionManager extends implementationOf(AccessDecisionManagerInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Security.Authorization.Voter.VoterInterface[]} [voters = []] An array or an iterator of VoterInterface instances
     * @param {string} [strategy = Jymfony.Component.Security.Authorization.AccessDecisionManager.STRATEGY_AFFIRMATIVE] The vote strategy
     * @param {boolean} [allowIfAllAbstainDecisions = false] Whether to grant access if all voters abstained or not
     * @param {boolean} [allowIfEqualGrantedDeniedDecisions = true] Whether to grant access if result are equals
     */
    __construct(voters = [], strategy = __self.STRATEGY_AFFIRMATIVE, allowIfAllAbstainDecisions = false, allowIfEqualGrantedDeniedDecisions = true) {
        const method = '_decide' + strategy.replace(/^\w/, c => c.toUpperCase());
        if (undefined === this[method] || ! isFunction(this[method])) {
            throw new InvalidArgumentException(__jymfony.sprintf('The strategy "%s" is not supported.', strategy));
        }

        /**
         * @type {string}
         *
         * @private
         */
        this._decide = method;

        /**
         * @type {Jymfony.Component.Security.Authorization.Voter.VoterInterface[]}
         *
         * @private
         */
        this._voters = voters;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._allowIfAllAbstainDecisions = allowIfAllAbstainDecisions;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._allowIfEqualGrantedDeniedDecisions = allowIfEqualGrantedDeniedDecisions;
    }

    /**
     * @inheritdoc
     */
    decide(token, attributes, object = undefined) {
        return this[this._decide](token, attributes, object);
    }

    /**
     * Grants access if any voter returns an affirmative response.
     *
     * If all voters abstained from voting, the decision will be based on the
     * allowIfAllAbstainDecisions property value (defaults to false).
     *
     * @param {Jymfony.Component.Security.Authentication.Token.TokenInterface} token A TokenInterface instance
     * @param {Array} attributes An array of attributes associated with the method being invoked
     * @param {Object} [object] The object to secure
     *
     * @returns {boolean}
     *
     * @private
     */
    _decideAffirmative(token, attributes, object = undefined) {
        let deny = 0;
        for (const voter of this._voters) {
            switch (voter.vote(token, object, attributes)) {
                case VoterInterface.ACCESS_GRANTED:
                    return true;

                case VoterInterface.ACCESS_DENIED:
                    ++deny;

                    break;

                default:
                    break;
            }
        }

        if (0 < deny) {
            return false;
        }

        return this._allowIfAllAbstainDecisions;
    }

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
     *
     * @param {Jymfony.Component.Security.Authentication.Token.TokenInterface} token A TokenInterface instance
     * @param {Array} attributes An array of attributes associated with the method being invoked
     * @param {Object} [object] The object to secure
     *
     * @returns {boolean}
     *
     * @private
     */
    _decideConsensus(token, attributes, object = undefined) {
        let grant = 0;
        let deny = 0;
        for (const voter of this._voters) {
            switch (voter.vote(token, object, attributes)) {
                case VoterInterface.ACCESS_GRANTED:
                    ++grant;

                    break;

                case VoterInterface.ACCESS_DENIED:
                    ++deny;

                    break;
            }
        }

        if (grant > deny) {
            return true;
        }

        if (deny >grant) {
            return false;
        }

        if (0 < grant) {
            return this._allowIfEqualGrantedDeniedDecisions;
        }

        return this._allowIfAllAbstainDecisions;
    }

    /**
     * Grants access if only grant (or abstain) votes were received.
     *
     * If all voters abstained from voting, the decision will be based on the
     * allowIfAllAbstainDecisions property value (defaults to false).
     *
     * @param {Jymfony.Component.Security.Authentication.Token.TokenInterface} token A TokenInterface instance
     * @param {Array} attributes An array of attributes associated with the method being invoked
     * @param {Object} [object] The object to secure
     *
     * @returns {boolean}
     *
     * @private
     */
    _decideUnanimous(token, attributes, object = undefined) {
        let grant = 0;
        for (const voter of this._voters) {
            for (const attribute of attributes) {
                switch (voter.vote(token, object, [ attribute ])) {
                    case VoterInterface.ACCESS_GRANTED:
                        ++grant;

                        break;

                    case VoterInterface.ACCESS_DENIED:
                        return false;

                    default:
                        break;
                }
            }
        }

        // No deny votes
        if (0 < grant) {
            return true;
        }

        return this._allowIfAllAbstainDecisions;
    }
}

AccessDecisionManager.STRATEGY_AFFIRMATIVE = 'affirmative';
AccessDecisionManager.STRATEGY_CONSENSUS = 'consensus';
AccessDecisionManager.STRATEGY_UNANIMOUS = 'unanimous';

module.exports = AccessDecisionManager;
