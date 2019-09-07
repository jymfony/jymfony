const Request = Jymfony.Component.HttpFoundation.Request;
const TokenStorage = Jymfony.Component.Security.Authentication.Token.Storage.TokenStorage;
const TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;
const Prophet = Jymfony.Component.Testing.Prophet;
const { expect } = require('chai');

describe('[Security] TokenStorage', function () {
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

    it('get set token should work', () => {
        const request = this._prophet.prophesize(Request).reveal();
        const token = this._prophet.prophesize(TokenInterface).reveal();

        const tokenStorage = new TokenStorage();
        tokenStorage.setToken(request, token);
        expect(tokenStorage.getToken(request)).to.be.equal(token);
    });
});
