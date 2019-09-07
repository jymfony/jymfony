const TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;
const AccessDecisionManager = Jymfony.Component.Security.Authorization.AccessDecisionManager;
const VoterInterface = Jymfony.Component.Security.Authorization.Voter.VoterInterface;
const Prophet = Jymfony.Component.Testing.Prophet;
const Argument = Jymfony.Component.Testing.Argument.Argument;
const { expect } = require('chai');

describe('[Security] AccessDecisionManager', function () {
    beforeEach(() => {
        /**
         * @type {Jymfony.Component.Testing.Prophet}
         *
         * @private
         */
        this._prophet = new Prophet();
    });

    afterEach(() => {
        if ('failed' === this.ctx.currentTest.state) {
            return;
        }

        this._prophet.checkPredictions();
    });

    it('should throw on unknown strategy', () => {
        expect(() => new AccessDecisionManager([], 'fooBar')).to.throw(InvalidArgumentException);
    });

    const getVoter = (vote) => {
        const voter = this._prophet.prophesize(VoterInterface);
        voter.vote(Argument.cetera()).willReturn(vote);

        return voter.reveal();
    };

    const getVoterFor2Roles = (vote1, vote2) => {
        const voter = this._prophet.prophesize(VoterInterface);
        voter.vote(Argument.cetera()).willReturn(vote1, vote2);

        return voter.reveal();
    };

    const getVoters = function * getVoters(grant, deny, abstain) {
        for (let i = 0; i < grant; ++i) {
            yield getVoter(VoterInterface.ACCESS_GRANTED);
        }
        for (let i = 0; i < deny; ++i) {
            yield getVoter(VoterInterface.ACCESS_DENIED);
        }
        for (let i = 0; i < abstain; ++i) {
            yield getVoter(VoterInterface.ACCESS_ABSTAIN);
        }
    };

    const getVotersFor2Roles = function * (vote1, vote2) {
        yield getVoterFor2Roles(vote1, vote2);
    };

    const getStrategyTests = function * getStrategyTests() {
        yield [ AccessDecisionManager.STRATEGY_AFFIRMATIVE, getVoters(1, 0, 0), false, true, true ];
        yield [ AccessDecisionManager.STRATEGY_AFFIRMATIVE, getVoters(1, 2, 0), false, true, true ];
        yield [ AccessDecisionManager.STRATEGY_AFFIRMATIVE, getVoters(0, 1, 0), false, true, false ];
        yield [ AccessDecisionManager.STRATEGY_AFFIRMATIVE, getVoters(0, 0, 1), false, true, false ];
        yield [ AccessDecisionManager.STRATEGY_AFFIRMATIVE, getVoters(0, 0, 1), true, true, true ];

        yield [ AccessDecisionManager.STRATEGY_CONSENSUS, getVoters(1, 0, 0), false, true, true ];
        yield [ AccessDecisionManager.STRATEGY_CONSENSUS, getVoters(1, 2, 0), false, true, false ];
        yield [ AccessDecisionManager.STRATEGY_CONSENSUS, getVoters(2, 1, 0), false, true, true ];
        yield [ AccessDecisionManager.STRATEGY_CONSENSUS, getVoters(0, 0, 1), false, true, false ];
        yield [ AccessDecisionManager.STRATEGY_CONSENSUS, getVoters(0, 0, 1), true, true, true ];
        yield [ AccessDecisionManager.STRATEGY_CONSENSUS, getVoters(2, 2, 0), false, true, true ];
        yield [ AccessDecisionManager.STRATEGY_CONSENSUS, getVoters(2, 2, 1), false, true, true ];
        yield [ AccessDecisionManager.STRATEGY_CONSENSUS, getVoters(2, 2, 0), false, false, false ];
        yield [ AccessDecisionManager.STRATEGY_CONSENSUS, getVoters(2, 2, 1), false, false, false ];

        yield [ AccessDecisionManager.STRATEGY_UNANIMOUS, getVoters(1, 0, 0), false, true, true ];
        yield [ AccessDecisionManager.STRATEGY_UNANIMOUS, getVoters(1, 0, 1), false, true, true ];
        yield [ AccessDecisionManager.STRATEGY_UNANIMOUS, getVoters(1, 1, 0), false, true, false ];
        yield [ AccessDecisionManager.STRATEGY_UNANIMOUS, getVoters(0, 0, 2), false, true, false ];
        yield [ AccessDecisionManager.STRATEGY_UNANIMOUS, getVoters(0, 0, 2), true, true, true ];
    };

    let i = 0;
    for (const [ strategy, voters, allowIfAllAbstain, allowIfEqualGrantedDenied, expected ] of getStrategyTests()) {
        it('strategy #'+(++i), () => {
            const token = this._prophet.prophesize(TokenInterface);
            const manager = new AccessDecisionManager(voters, strategy, allowIfAllAbstain, allowIfEqualGrantedDenied);

            expect(manager.decide(token.reveal(), [ 'ROLE_FOO' ])).to.be.equal(expected);
        });
    }

    const getStrategyWith2RolesTests = function * getStrategyWith2RolesTests() {
        yield [ getVotersFor2Roles(VoterInterface.ACCESS_DENIED, VoterInterface.ACCESS_DENIED), false ];
        yield [ getVotersFor2Roles(VoterInterface.ACCESS_DENIED, VoterInterface.ACCESS_GRANTED), false ];
        yield [ getVotersFor2Roles(VoterInterface.ACCESS_GRANTED, VoterInterface.ACCESS_DENIED), false ];
        yield [ getVotersFor2Roles(VoterInterface.ACCESS_GRANTED, VoterInterface.ACCESS_GRANTED), true ];
    };

    i = 0;
    for (const [ voter, expected ] of getStrategyWith2RolesTests()) {
        it('strategy with 2 roles #'+(++i), () => {
            const token = this._prophet.prophesize(TokenInterface);
            const manager = new AccessDecisionManager(voter, AccessDecisionManager.STRATEGY_UNANIMOUS);

            expect(manager.decide(token.reveal(), [ 'ROLE_FOO', 'ROLE_BAR' ])).to.be.equal(expected);
        });
    }
});
