const AuthenticationTrustResolver = Jymfony.Component.Security.Authentication.AuthenticationTrustResolver;
const Token = Jymfony.Component.Security.Authentication.Token;
const Prophet = Jymfony.Component.Testing.Prophet;
const expect = require('chai').expect;

describe('[Security] AuthenticationTrustResolver', function () {
    beforeEach(() => {
        /**
         * @type {Jymfony.Component.Testing.Prophet}
         *
         * @private
         */
        this._prophet = new Prophet();

        /**
         * @type {Jymfony.Component.Security.Authentication.AuthenticationTrustResolver}
         *
         * @private
         */
        this._resolver = new AuthenticationTrustResolver(
            'Jymfony.Component.Security.Authentication.Token.AnonymousToken',
            'Jymfony.Component.Security.Authentication.Token.RememberMeToken'
        );
    });

    afterEach(() => {
        this._prophet.checkPredictions();
    });

    const anonymousToken = () => {
        return this._prophet.prophesize(Token.AnonymousToken).reveal();
    };
    const rememberMeToken = () => {
        return this._prophet.prophesize(Token.RememberMeToken).reveal();
    };
    const token = () => {
        return this._prophet.prophesize(Token.TokenInterface).reveal();
    };

    it('isAnonymous should work', () => {
        expect(this._resolver.isAnonymous(null)).to.be.false;
        expect(this._resolver.isAnonymous(rememberMeToken())).to.be.false;
        expect(this._resolver.isAnonymous(token())).to.be.false;
        expect(this._resolver.isAnonymous(anonymousToken())).to.be.true;
    });

    it('isRememberMe should work', () => {
        expect(this._resolver.isRememberMe(null)).to.be.false;
        expect(this._resolver.isRememberMe(rememberMeToken())).to.be.true;
        expect(this._resolver.isRememberMe(token())).to.be.false;
        expect(this._resolver.isRememberMe(anonymousToken())).to.be.false;
    });

    it('isFullFledged should work', () => {
        expect(this._resolver.isFullFledged(null)).to.be.false;
        expect(this._resolver.isFullFledged(rememberMeToken())).to.be.false;
        expect(this._resolver.isFullFledged(token())).to.be.true;
        expect(this._resolver.isFullFledged(anonymousToken())).to.be.false;
    });
});
