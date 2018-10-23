require('../../../fixtures/namespace');

const Fixtures = Jymfony.Component.Security.Fixtures.Authentication.Token;
const UsernamePasswordToken = Jymfony.Component.Security.Authentication.Token.UsernamePasswordToken;
const Role = Jymfony.Component.Security.Role.Role;
const expect = require('chai').expect;

describe('[Security] UsernamePasswordToken', function () {
    it('constructor should work', () => {
        let token = new UsernamePasswordToken(new Fixtures.TestUser('foo'), 'bar', 'key');
        expect(token.authenticated).to.be.false;

        token = new UsernamePasswordToken(new Fixtures.TestUser('foo'), 'bar', 'key', [ new Role('FOO') ]);
        expect(token.authenticated).to.be.true;
        expect(token.roles).to.be.deep.equal([ new Role('FOO') ]);
        expect(token.providerKey).to.be.equal('key');
    });

    it('set authenticated to true should throw', () => {
        const token = new UsernamePasswordToken(new Fixtures.TestUser('foo'), 'bar', 'key');
        expect(() => {
            token.authenticated = true;
        }).to.throw(LogicException);
    });

    it('set authenticated to false should work', () => {
        const token = new UsernamePasswordToken(new Fixtures.TestUser('foo'), 'bar', 'key');
        token.authenticated = false;
        expect(token.authenticated).to.be.false;
    });

    it('eraseCredentials should delete credentials', () => {
        const token = new UsernamePasswordToken(new Fixtures.TestUser('foo'), 'bar', 'key');
        token.eraseCredentials();

        expect(token.credentials).to.be.undefined;
    });

    it('toString', () => {
        const token = new UsernamePasswordToken(new Fixtures.TestUser('foo'), 'bar', 'key', [ 'A', 'B' ]);
        expect(token.toString())
            .to.be.equal('UsernamePasswordToken(user="foo", authenticated=true, roles="A, B")');
    });
});
