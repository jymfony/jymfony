const AuthenticationTrustResolver = Jymfony.Component.Security.Authentication.AuthenticationTrustResolver;
const AnonymousToken = Jymfony.Component.Security.Authentication.Token.AnonymousToken;
const RememberMeToken = Jymfony.Component.Security.Authentication.Token.RememberMeToken;
const TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;
const AuthenticatedVoter = Jymfony.Component.Security.Authorization.Voter.AuthenticatedVoter;
const VoterInterface = Jymfony.Component.Security.Authorization.Voter.VoterInterface;
const Prophet = Jymfony.Component.Testing.Prophet;
const expect = require('chai').expect;

describe('[Security] AuthenticatedVoter', function () {
    beforeEach(() => {
        /**
         * @type {Jymfony.Component.Testing.Prophet}
         *
         * @private
         */
        this._prophet = new Prophet();

        /**
         * @type {Jymfony.Component.Security.Authorization.Voter.AuthenticatedVoter}
         *
         * @private
         */
        this._voter = new AuthenticatedVoter(new AuthenticationTrustResolver(
            'Jymfony.Component.Security.Authentication.Token.AnonymousToken',
            'Jymfony.Component.Security.Authentication.Token.RememberMeToken'
        ));
    });

    afterEach(() => {
        this._prophet.checkPredictions();
    });

    const getVoteTests = function * () {
        yield [ 'fully', [], VoterInterface.ACCESS_ABSTAIN ];
        yield [ 'fully', [ 'FOO' ], VoterInterface.ACCESS_ABSTAIN ];
        yield [ 'remembered', [], VoterInterface.ACCESS_ABSTAIN ];
        yield [ 'remembered', [ 'FOO' ], VoterInterface.ACCESS_ABSTAIN ];
        yield [ 'anonymously', [], VoterInterface.ACCESS_ABSTAIN ];
        yield [ 'anonymously', [ 'FOO' ], VoterInterface.ACCESS_ABSTAIN ];

        yield [ 'fully', [ 'IS_AUTHENTICATED_ANONYMOUSLY' ], VoterInterface.ACCESS_GRANTED ];
        yield [ 'remembered', [ 'IS_AUTHENTICATED_ANONYMOUSLY' ], VoterInterface.ACCESS_GRANTED ];
        yield [ 'anonymously', [ 'IS_AUTHENTICATED_ANONYMOUSLY' ], VoterInterface.ACCESS_GRANTED ];

        yield [ 'fully', [ 'IS_AUTHENTICATED_REMEMBERED' ], VoterInterface.ACCESS_GRANTED ];
        yield [ 'remembered', [ 'IS_AUTHENTICATED_REMEMBERED' ], VoterInterface.ACCESS_GRANTED ];
        yield [ 'anonymously', [ 'IS_AUTHENTICATED_REMEMBERED' ], VoterInterface.ACCESS_DENIED ];

        yield [ 'fully', [ 'IS_AUTHENTICATED_FULLY' ], VoterInterface.ACCESS_GRANTED ];
        yield [ 'remembered', [ 'IS_AUTHENTICATED_FULLY' ], VoterInterface.ACCESS_DENIED ];
        yield [ 'anonymously', [ 'IS_AUTHENTICATED_FULLY' ], VoterInterface.ACCESS_DENIED ];
    };

    const getToken = (authenticated) => {
        if ('fully' === authenticated) {
            return this._prophet.prophesize(TokenInterface).reveal();
        } else if ('remembered' === authenticated) {
            return this._prophet.prophesize(RememberMeToken).reveal();
        }
        return this._prophet.prophesize(AnonymousToken).reveal();

    };

    let index = 0;
    for (const [ authenticated, attributes, expected ] of getVoteTests()) {
        it('vote should work with dataset #' + index++, () => {
            expect(this._voter.vote(getToken(authenticated), null, attributes)).to.be.equal(expected);
        });
    }
});
