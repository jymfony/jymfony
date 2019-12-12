const ControllerResolverInterface = Jymfony.Component.HttpFoundation.Controller.ControllerResolverInterface;
const Request = Jymfony.Component.HttpFoundation.Request;
const Response = Jymfony.Component.HttpFoundation.Response;
const HttpServerEvents = Jymfony.Component.HttpServer.Event.HttpServerEvents;
const RequestTimeoutException = Jymfony.Component.HttpServer.Exception.RequestTimeoutException;
const AccessDeniedHttpException = Jymfony.Component.HttpFoundation.Exception.AccessDeniedHttpException;
const RequestHandler = Jymfony.Component.HttpServer.RequestHandler;
const EventDispatcherInterface = Jymfony.Contracts.EventDispatcher.EventDispatcherInterface;
const Argument = Jymfony.Component.Testing.Argument.Argument;
const Prophet = Jymfony.Component.Testing.Prophet;
const Event = Jymfony.Contracts.HttpServer.Event;
const { expect } = require('chai');

describe('[HttpServer] RequestHandler', function () {
    this.timeout(60000);

    beforeEach(() => {
        /**
         * @type {Jymfony.Component.Testing.Prophet}
         *
         * @private
         */
        this._prophet = new Prophet();

        /**
         * @type {Jymfony.Component.Testing.Prophecy.ObjectProphecy<Jymfony.Contracts.EventDispatcher.EventDispatcherInterface>}
         *
         * @private
         */
        this._dispatcher = this._prophet.prophesize(EventDispatcherInterface);

        this._dispatcher.dispatch(HttpServerEvents.REQUEST, Argument.any()).willReturn();
        this._dispatcher.dispatch(HttpServerEvents.RESPONSE, Argument.any()).willReturn();
        this._dispatcher.dispatch(HttpServerEvents.FINISH_REQUEST, Argument.any()).willReturn();
        this._dispatcher.dispatch(HttpServerEvents.CONTROLLER, Argument.any()).willReturn();
        this._dispatcher.dispatch(HttpServerEvents.VIEW, Argument.any()).willReturn();

        /**
         * @type {Jymfony.Component.Testing.Prophecy.ObjectProphecy<Jymfony.Component.HttpFoundation.Controller.ControllerResolverInterface>}
         *
         * @private
         */
        this._resolver = this._prophet.prophesize(ControllerResolverInterface);

        this._handler = new RequestHandler(this._dispatcher.reveal(), this._resolver.reveal());
    });

    afterEach(() => {
        if ('failed' === this.ctx.currentTest.state) {
            return;
        }

        this._prophet.checkPredictions();
    });

    it('should dispatch request event', async () => {
        const req = new Request('/');

        this._dispatcher.dispatch(HttpServerEvents.REQUEST, Argument.type(Event.RequestEvent))
            .shouldBeCalled()
            .will((eventName, e) => {
                expect(e.request).to.be.equal(req);
                e.response = new Response();
            });

        await this._handler.handle(req, false);
    });

    it('should throw if controller resolver returns no result', async () => {
        const req = new Request('/');
        this._resolver.getController(req).willReturn(false);

        try {
            await this._handler.handle(req, false);
            throw new Error('FAIL');
        } catch (e) {
            expect(e.message).to.match(/Unable to find the controller for path ".+"\. The route is wrongly configured\./);
        }
    });

    it('should dispatch controller event and can be changed', async () => {
        const req = new Request('/');
        const controller = () => {
            throw new Error('This should not be called');
        };
        const controller2 = () => new Response();

        this._dispatcher.dispatch(HttpServerEvents.CONTROLLER, Argument.type(Event.ControllerEvent))
            .shouldBeCalled()
            .will((eventName, e) => {
                expect(e.request).to.be.equal(req);
                expect(e.controller).to.be.equal(controller);

                e.controller = controller2;
            });

        this._resolver.getController(req).willReturn(controller);

        expect(await this._handler.handle(req, false)).to.be.instanceOf(Response);
    });

    it('should dispatch view event if controller does not return a response', async () => {
        const req = new Request('/');
        const controller = () => {
            return 'foobar';
        };

        this._dispatcher.dispatch(HttpServerEvents.VIEW, Argument.type(Event.ViewEvent))
            .shouldBeCalled()
            .will((eventName, e) => {
                expect(e.request).to.be.equal(req);
                expect(e.controllerResult).to.be.equal('foobar');

                e.response = new Response(e.controllerResult);
            });

        this._resolver.getController(req).willReturn(controller);

        expect(await this._handler.handle(req, false)).to.be.instanceOf(Response);
    });

    it('should throw if controller does not return a response', async () => {
        const req = new Request('/');
        const controller = () => {};

        this._resolver.getController(req).willReturn(controller);

        try {
            await this._handler.handle(req, false);
            throw new Error('FAIL');
        } catch (e) {
            expect(e).to.be.instanceOf(LogicException);
            expect(e.message).to.match(/The controller must return a response\. Did you forget to add a return statement somewhere in your controller\?/);
        }
    });

    it('should throw if timeout reached', async () => {
        this._handler.requestTimeoutMs = 1000;

        const req = new Request('/');
        const controller = async () => {
            await __jymfony.sleep(3000);
        };

        this._resolver.getController(req).willReturn(controller);

        try {
            await this._handler.handle(req, false);
            throw new Error('FAIL');
        } catch (e) {
            expect(e).to.be.instanceOf(RequestTimeoutException);
        }
    });

    it('should handle exceptions and dispatch exception event', async () => {
        const req = new Request('/');
        const controller = () => {};

        this._dispatcher.dispatch(HttpServerEvents.EXCEPTION, Argument.type(Event.ExceptionEvent))
            .shouldBeCalled()
            .will((eventName, e) => {
                e.response = new Response(null, Response.HTTP_INTERNAL_SERVER_ERROR);
            });

        this._resolver.getController(req).willReturn(controller);
        const response = await this._handler.handle(req);

        expect(response.statusCode).to.be.equal(500);
    });

    it('should throw exception if no listener sets a response.', async () => {
        const req = new Request('/');
        const error = new Error('TEST');
        const controller = () => {
            throw error;
        };

        this._dispatcher.dispatch(HttpServerEvents.EXCEPTION, Argument.type(Event.ExceptionEvent)).shouldBeCalled();
        this._resolver.getController(req).willReturn(controller);

        try {
            await this._handler.handle(req);
            throw new Error('FAIL');
        } catch (e) {
            expect(e).to.be.equal(error);
        }
    });

    it('should set correct response code on http exceptions', async () => {
        const req = new Request('/');
        const controller = () => {
            throw new AccessDeniedHttpException('Fobidden.');
        };

        this._dispatcher.dispatch(HttpServerEvents.EXCEPTION, Argument.type(Event.ExceptionEvent))
            .shouldBeCalled()
            .will((eventName, e) => {
                e.response = new Response(e.exception.message);
            });

        this._resolver.getController(req).willReturn(controller);
        const response = await this._handler.handle(req);

        expect(response.statusCode).to.be.equal(403);
    });
});
