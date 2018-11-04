const RoleHierarchyVoter = Jymfony.Component.Security.Authorization.Voter.RoleHierarchyVoter;
const VoterInterface = Jymfony.Component.Security.Authorization.Voter.VoterInterface;
const RoleHierarchy = Jymfony.Component.Security.Role.RoleHierarchy;
const Role = Jymfony.Component.Security.Role.Role;
const Prophet = Jymfony.Component.Testing.Prophet;
const RoleVoterTest = require('./RoleVoterTest');
const expect = require('chai').expect;

class RoleHierarchyVoterTest extends RoleVoterTest {
    execTests() {
        describe('[Security] RoleHierarchyVoter', () => {
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
            for (const [ roles, attributes, expected ] of super._getVoteTests()) {
                it(
                    'vote role hierarchy should work with dataset #' + index++,
                    () => this.testVoteWithEmptyHierarchy(roles, attributes, expected)
                );
            }
        });
    }

    testVote(roles, attributes, expected) {
        const voter = new RoleHierarchyVoter(new RoleHierarchy({'ROLE_FOO': [ 'ROLE_FOOBAR' ]}));
        expect(voter.vote(this._getToken(roles), null, attributes)).to.be.equal(expected);
    }

    * _getVoteTests() {
        yield * super._getVoteTests();

        yield [ [ 'ROLE_FOO' ], [ new Role('ROLE_FOOBAR') ], VoterInterface.ACCESS_GRANTED ];
    }

    testVoteWithEmptyHierarchy(roles, attributes, expected) {
        const voter = new RoleHierarchyVoter(new RoleHierarchy([]));
        expect(voter.vote(this._getToken(roles), null, attributes)).to.be.equal(expected);
    }
}

module.exports = RoleHierarchyVoterTest;
