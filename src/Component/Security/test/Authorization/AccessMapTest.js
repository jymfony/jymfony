const Request = Jymfony.Component.HttpFoundation.Request;
const RequestMatcherInterface = Jymfony.Component.HttpFoundation.RequestMatcherInterface;
const AccessMap = Jymfony.Component.Security.Authorization.AccessMap;
const Prophet = Jymfony.Component.Testing.Prophet;
const { expect } = require('chai');

describe('[Security] AccessMap', function () {
    beforeEach(() => {
        /**
         * @type {Jymfony.Component.Testing.Prophet}
         *
         * @private
         */
        this._prophet = new Prophet();

        this._map = new AccessMap();
    });

    afterEach(() => {
        if ('failed' === this.ctx.currentTest.state) {
            return;
        }

        this._prophet.checkPredictions();
    });

    const getRequestMatcher = (request, match) => {
        const matcher = this._prophet.prophesize(RequestMatcherInterface);
        matcher.matches(request).willReturn(match);

        return matcher.reveal();
    };

    it('should return first matched pattern', () => {
        const request = Request.create('/', Request.METHOD_GET);
        const matcher1 = getRequestMatcher(request, false);
        const matcher2 = getRequestMatcher(request, true);

        this._map.add(matcher1, [ 'ROLE_ADMIN' ], 'http');
        this._map.add(matcher2, [ 'ROLE_USER' ], 'https');

        expect(this._map.getPatterns(request))
            .to.be.deep.equal([ [ 'ROLE_USER' ], 'https' ]);
    });

    it('should return empty pattern if none matched', () => {
        const request = Request.create('/', Request.METHOD_GET);
        this._map.add(getRequestMatcher(request, false), [ 'ROLE_ADMIN' ], 'http');

        expect(this._map.getPatterns(request))
            .to.be.deep.equal([ undefined, undefined ]);
    });
});
