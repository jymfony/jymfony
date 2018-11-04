const TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;
const AuthorizationChecker = Jymfony.Component.Security.Authorization.AuthorizationChecker;
const AccessDecisionManagerInterface = Jymfony.Component.Security.Authorization.AccessDecisionManagerInterface;
const Prophet = Jymfony.Component.Testing.Prophet;
const expect = require('chai').expect;

describe('[Security] AuthorizationChecker', function () {
    beforeEach(() => {
        /**
         * @type {Jymfony.Component.Testing.Prophet}
         *
         * @private
         */
        this._prophet = new Prophet();

        /**
         * @type {Jymfony.Component.Security.Authorization.AccessDecisionManagerInterface|Jymfony.Component.Testing.Prophecy.ObjectProphecy}
         *
         * @private
         */
        this._accessDecisionManager = this._prophet.prophesize(AccessDecisionManagerInterface);

        /**
         * @type {Jymfony.Component.Security.Authorization.AuthorizationChecker}
         *
         * @private
         */
        this._authorizationChecker = new AuthorizationChecker(this._accessDecisionManager.reveal());
    });

    afterEach(() => {
        this._prophet.checkPredictions();
    });

    for (const decide of [ true, false ]) {
        it('should decide', () => {
            const token = this._prophet.prophesize(TokenInterface);
            token.authenticated().willReturn(true);

            this._accessDecisionManager.decide(token, [ 'ROLE_FOO' ], undefined).shouldBeCalled().willReturn(decide);
            expect(this._authorizationChecker.isGranted(token.reveal(), 'ROLE_FOO')).to.be.equal(decide);
        });
    }
});
