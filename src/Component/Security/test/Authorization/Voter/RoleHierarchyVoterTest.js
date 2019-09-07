const RoleHierarchyVoter = Jymfony.Component.Security.Authorization.Voter.RoleHierarchyVoter;
const VoterInterface = Jymfony.Component.Security.Authorization.Voter.VoterInterface;
const RoleHierarchy = Jymfony.Component.Security.Role.RoleHierarchy;
const Role = Jymfony.Component.Security.Role.Role;
const RoleVoterTest = require('./RoleVoterTest');
const { expect } = require('chai');

class RoleHierarchyVoterTest extends RoleVoterTest {
    execTests() {
        const self = this;
        const parentTests = super._getVoteTests();
        describe('[Security] RoleHierarchyVoter', function () {
            beforeEach(self.beforeEach.bind(self));
            afterEach(() => {
                if ('failed' === this.ctx.currentTest.state) {
                    return;
                }

                self.afterEach();
            });

            let index = 0;
            for (const [ roles, attributes, expected ] of parentTests) {
                it(
                    'vote role hierarchy with empty hierarchy should work with dataset #' + index++,
                    () => self.testVoteWithEmptyHierarchy(roles, attributes, expected)
                );
            }

            index = 0;
            for (const [ roles, attributes, expected ] of self._getVoteTests()) {
                it(
                    'vote role hierarchy should work with dataset #' + index++,
                    () => self.testVote(roles, attributes, expected)
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
