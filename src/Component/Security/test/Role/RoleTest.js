const Role = Jymfony.Component.Security.Role.Role;
const expect = require('chai').expect;

describe('[Security] Role', function () {
    it('identifier is correct', () => {
        const role = new Role('FOO');

        expect(role.toString()).to.be.equal('FOO');
        expect(role.role).to.be.equal('FOO');
    });

    it('should be a singleton', () => {
        const role1 = new Role('TEST_SINGLETON');
        const role2 = new Role('TEST_SINGLETON');
        const role3 = new Role('TEST_NON_SINGLETON');

        expect(role1).to.be.equal(role2);
        expect(role1).to.be.not.equal(role3);
    });
});
