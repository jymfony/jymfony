const TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;
const Role = Jymfony.Component.Security.Role.Role;
const VoterInterface = Jymfony.Component.Security.Authorization.Voter.VoterInterface;
const RoleVoter = Jymfony.Component.Security.Authorization.Voter.RoleVoter;
const Prophet = Jymfony.Component.Testing.Prophet;
const expect = require('chai').expect;

class RoleVoterTest {
    execTests() {
        describe('[Security] RoleVoter', () => {
            beforeEach(() => {
                /**
                 * @type {Jymfony.Component.Testing.Prophet}
                 *
                 * @private
                 */
                this._prophet = new Prophet();
            });

            afterEach(() => {
                this._prophet.checkPredictions();
            });

            let index = 0;
            for (const [ roles, attributes, expected ] of this._getVoteTests()) {
                it('vote should work with dataset #' + index++, () => this.testVote(roles, attributes, expected));
            }
        });
    }

    testVote(roles, attributes, expected) {
        const voter = new RoleVoter();
        expect(voter.vote(this._getToken(roles), null, attributes)).to.be.equal(expected);
    }

    * _getVoteTests() {
        yield [ [], [], VoterInterface.ACCESS_ABSTAIN ];
        yield [ [], [ 'FOO' ], VoterInterface.ACCESS_ABSTAIN ];
        yield [ [], [ 'ROLE_FOO' ], VoterInterface.ACCESS_DENIED ];
        yield [ [ 'ROLE_FOO' ], [ 'ROLE_FOO' ], VoterInterface.ACCESS_GRANTED ];
        yield [ [ 'ROLE_FOO' ], [ 'FOO', 'ROLE_FOO' ], VoterInterface.ACCESS_GRANTED ];
        yield [ [ 'ROLE_BAR', 'ROLE_FOO' ], [ 'ROLE_FOO' ], VoterInterface.ACCESS_GRANTED ];

        // Test mixed Types
        yield [ [], [ [] ], VoterInterface.ACCESS_ABSTAIN ];
        yield [ [], [ {} ], VoterInterface.ACCESS_ABSTAIN ];
        yield [ [ 'ROLE_BAR' ], [ new Role('ROLE_BAR') ], VoterInterface.ACCESS_GRANTED ];
        yield [ [ 'ROLE_BAR' ], [ new Role('ROLE_FOO') ], VoterInterface.ACCESS_DENIED ];
    }

    _getToken(roles) {
        const token = this._prophet.prophesize(TokenInterface);
        token.roles().willReturn(roles.map(r => new Role(r)));

        return token.reveal();
    }
}

module.exports = RoleVoterTest;
