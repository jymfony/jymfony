const AnonymousAuthenticationProvider = Jymfony.Component.Security.Authentication.Provider.AnonymousAuthenticationProvider;
const AnonymousToken = Jymfony.Component.Security.Authentication.Token.AnonymousToken;
const TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;
const AuthenticationException = Jymfony.Component.Security.Exception.AuthenticationException;
const BadCredentialsException = Jymfony.Component.Security.Exception.BadCredentialsException;
const Prophet = Jymfony.Component.Testing.Prophet;
const expect = require('chai').expect;

describe('[Security] AnonymousAuthenticationProvider', function () {
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

    const getProvider = (secret) => {
        return new AnonymousAuthenticationProvider(secret);
    };

    const getSupportedToken = (secret) => {
        const token = this._prophet.prophesize(AnonymousToken);
        token.secret().willReturn(secret);

        return token.reveal();
    };

    it('support should work', () => {
        const provider = getProvider('foo');

        expect(provider.supports(getSupportedToken('foo'))).to.be.true;
        expect(provider.supports(this._prophet.prophesize(TokenInterface).reveal())).to.be.false;
    });

    it('authenticate should throw if token is not supported', async () => {
        const provider = getProvider('foo');

        try {
            await provider.authenticate(this._prophet.prophesize(TokenInterface).reveal());
        } catch(e) {
            expect(e).to.be.instanceOf(AuthenticationException);
            return;
        }

        throw new Error('FAIL');
    });

    it('authenticate should throw if secret is wrong', async () => {
        const provider = getProvider('foo');

        try {
            await provider.authenticate(getSupportedToken('bar'));
        } catch (e) {
            expect(e).to.be.instanceOf(BadCredentialsException);
            return;
        }

        throw new Error('FAIL');
    });

    it('authenticate should work', async () => {
        const provider = getProvider('foo');
        const token = getSupportedToken('foo');

        expect(await provider.authenticate(token)).to.be.equal(token);
    });
});
