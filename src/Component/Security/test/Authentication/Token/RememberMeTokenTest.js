const RememberMeToken = Jymfony.Component.Security.Authentication.Token.RememberMeToken;
const UserInterface = Jymfony.Component.Security.User.UserInterface;
const Role = Jymfony.Component.Security.Role.Role;
const Prophet = Jymfony.Component.Testing.Prophet;
const { expect } = require('chai');

describe('[Security] RememberMeToken', function () {
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

    const getUser = (roles = [ 'ROLE_FOO' ]) => {
        const user = this._prophet.prophesize(UserInterface);
        user.roles().willReturn(roles);

        return user.reveal();
    };

    it('constructor should work', () => {
        const user = getUser();
        const token = new RememberMeToken(user, 'fookey', 'foo');

        expect(token.providerKey).to.be.equal('fookey');
        expect(token.secret).to.be.equal('foo');
        expect(token.roles).to.be.deep.equal([ new Role('ROLE_FOO') ]);
        expect(token.user).to.be.equal(user);
        expect(token.authenticated).to.be.true;
    });

    it('secret cannot be empty string', () => {
        expect(() => {
            new RememberMeToken(getUser(), '', '');
        }).to.throw(InvalidArgumentException);
    });
});
