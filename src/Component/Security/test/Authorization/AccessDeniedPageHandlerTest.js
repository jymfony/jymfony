const Request = Jymfony.Component.HttpFoundation.Request;
const Response = Jymfony.Component.HttpFoundation.Response;
const HttpServer = Jymfony.Component.HttpServer.HttpServer;
const AccessDeniedPageHandler = Jymfony.Component.Security.Authorization.AccessDeniedPageHandler;
const HttpUtils = Jymfony.Component.Security.Http.HttpUtils;
const Argument = Jymfony.Component.Testing.Argument.Argument;
const Prophet = Jymfony.Component.Testing.Prophet;
const { expect } = require('chai');

describe('[Security] AccessDecisionManager', function () {
    beforeEach(() => {
        /**
         * @type {Jymfony.Component.Testing.Prophet}
         *
         * @private
         */
        this._prophet = new Prophet();

        this._httpUtils = this._prophet.prophesize(HttpUtils);
        this._requestHandler = this._prophet.prophesize(HttpServer);
        this._handler = new AccessDeniedPageHandler(this._httpUtils.reveal(), this._requestHandler.reveal(), 'test');
    });

    afterEach(() => {
        this._prophet.checkPredictions();
    });

    it('should render error page', async () => {
        const request = Request.create('/', Request.METHOD_GET);
        const response = new Response();
        const exception = new Exception();

        this._httpUtils.generateUri(request, 'test').shouldBeCalled().willReturn('/error');
        this._requestHandler.handle(Argument.that(arg => {
            expect(arg).to.be.instanceOf(Request);
            expect(arg.pathInfo).to.be.equal('/error');
            expect(arg.attributes.get('_security.403_error')).to.be.equal(exception);

            return true;
        })).willReturn(response);

        expect(await this._handler.handle(request, exception)).to.be.equal(response);
    });
});
