require('../../../fixtures/namespace');

const Fixtures = Jymfony.Component.Security.Fixtures.Authentication.Token;
const SwitchUserRole = Jymfony.Component.Security.Role.SwitchUserRole;
const Prophet = Jymfony.Component.Testing.Prophet;
const { expect } = require('chai');

describe('[Security] AbstractToken', function () {
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

    it('get username should work', () => {
        let token = new Fixtures.ConcreteToken(new Fixtures.TestUser('fabien'), [ 'ROLE_FOO' ]);
        expect(token.username).to.be.equal('fabien');

        const user = this._prophet.prophesize(Jymfony.Component.Security.User.UserInterface);
        user.username().willReturn('fabien').shouldBeCalledTimes(1);
        token = new Fixtures.ConcreteToken(user.reveal(), [ 'ROLE_FOO' ]);

        expect(token.username).to.be.equal('fabien');
    });

    it('erase credentials should call user\'s one', () => {
        const user = this._prophet.prophesize(Jymfony.Component.Security.User.UserInterface);
        user.eraseCredentials().shouldBeCalled();
        const token = new Fixtures.ConcreteToken(user.reveal(), [ 'ROLE_FOO' ]);

        token.eraseCredentials();
    });

    it('serialization', () => {
        const token = new Fixtures.ConcreteToken(null, [ 'ROLE_FOO', 'ROLE_BAR' ]);
        token.attributes = { foo: 'bar' };

        const serialized = __jymfony.serialize(token);
        const obj = __jymfony.unserialize(serialized);

        expect(obj.roles).to.be.deep.equal(token.roles);
        expect(obj.attributes).to.be.deep.equal(token.attributes);
    });

    it('deep serialization', () => {
        const user = new Fixtures.TestUser('alex');
        const token = new Fixtures.ConcreteToken(user, [ 'ROLE_FOO' ]);
        const parentToken = new Fixtures.ConcreteToken(user, [ new SwitchUserRole('ROLE_PREVIOUS', token) ]);

        const serialized = __jymfony.serialize(parentToken);
        const obj = __jymfony.unserialize(serialized);

        expect(obj.roles[0].source.user).to.be.deep.equal(parentToken.roles[0].source.user);
    });

    it('authenticated flag', () => {
        const user = new Fixtures.TestUser('alex');
        const token = new Fixtures.ConcreteToken(user, [ 'ROLE_FOO' ]);

        expect(token.authenticated).to.be.false;

        token.authenticated = true;
        expect(token.authenticated).to.be.true;

        token.authenticated = false;
        expect(token.authenticated).to.be.false;
    });

    it('attributes', () => {
        const user = new Fixtures.TestUser('alex');
        const token = new Fixtures.ConcreteToken(user, [ 'ROLE_FOO' ]);

        token.attributes = { foo: 'bar' };
        expect(token.attributes).to.be.deep.equal({ foo: 'bar' });
        expect(token.getAttribute('foo')).to.be.equal('bar');
        token.setAttribute('foo', 'foo');
        expect(token.getAttribute('foo')).to.be.equal('foo');
        expect(token.hasAttribute('foo')).to.be.true;
        expect(token.hasAttribute('oof')).to.be.false;

        expect(token.getAttribute.bind(token, 'foobar')).to.throw(InvalidArgumentException);
    });

    it('setting user should change authenticated flag', () => {
        const user = new Fixtures.TestUser('alex');
        const token = new Fixtures.ConcreteToken(null, [ 'ROLE_FOO' ]);
        token.authenticated = true;

        token.user = user;
        expect(token.authenticated).to.be.true;

        token.user = new Fixtures.TestUser('max');
        expect(token.authenticated).to.be.false;
    });
});
