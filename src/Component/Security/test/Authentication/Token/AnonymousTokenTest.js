const AnonymousToken = Jymfony.Component.Security.Authentication.Token.AnonymousToken;
const Role = Jymfony.Component.Security.Role.Role;
const expect = require('chai').expect;

describe('[Security] AnonymousToken', function () {
    it('constructor should work', () => {
        let token = new AnonymousToken('foo');
        expect(token.secret).to.be.equal('foo');

        token = new AnonymousToken('bar', [ new Role('FOO') ]);
        expect(token.roles).to.be.deep.equal([ new Role('FOO') ]);
    });

    it('credentials returns null', () => {
        const token = new AnonymousToken('foo');
        expect(token.credentials).to.be.null;
    });
});
