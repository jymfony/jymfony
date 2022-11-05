import { expect } from 'chai';

const AccessDeniedHttpException = Jymfony.Component.HttpFoundation.Exception.AccessDeniedHttpException;
const Argument = Jymfony.Component.Testing.Argument.Argument;
const ControllerResolverInterface = Jymfony.Component.HttpFoundation.Controller.ControllerResolverInterface;
const Event = Jymfony.Contracts.HttpServer.Event;
const EventDispatcherInterface = Jymfony.Contracts.EventDispatcher.EventDispatcherInterface;
const HttpServerEvents = Jymfony.Component.HttpServer.Event.HttpServerEvents;
const Request = Jymfony.Component.HttpFoundation.Request;
const RequestHandler = Jymfony.Component.HttpServer.RequestHandler;
const RequestTimeoutException = Jymfony.Component.HttpServer.Exception.RequestTimeoutException;
const Response = Jymfony.Component.HttpFoundation.Response;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const TimeSensitiveTestCaseTrait = Jymfony.Component.Testing.Framework.TimeSensitiveTestCaseTrait;

export default class RequestHandlerTest extends mix(TestCase, TimeSensitiveTestCaseTrait) {
    get testCaseName() {
        return '[HttpServer] RequestHandler';
    }

    __construct() {
        super.__construct();

        /**
         * @type {Jymfony.Component.Testing.Prophecy.ObjectProphecy<Jymfony.Contracts.EventDispatcher.EventDispatcherInterface>}
         *
         * @private
         */
        this._dispatcher = undefined;

        /**
         * @type {Jymfony.Component.Testing.Prophecy.ObjectProphecy<Jymfony.Component.HttpFoundation.Controller.ControllerResolverInterface>}
         *
         * @private
         */
        this._resolver = undefined;

        /**
         * @type {Jymfony.Component.HttpServer.RequestHandler}
         *
         * @private
         */
        this._handler = undefined;
    }

    beforeEach() {
        this._dispatcher = this.prophesize(EventDispatcherInterface);
        this._dispatcher.dispatch(Argument.any(), HttpServerEvents.REQUEST).willReturn();
        this._dispatcher.dispatch(Argument.any(), HttpServerEvents.RESPONSE).willReturn();
        this._dispatcher.dispatch(Argument.any(), HttpServerEvents.FINISH_REQUEST).willReturn();
        this._dispatcher.dispatch(Argument.any(), HttpServerEvents.CONTROLLER).willReturn();
        this._dispatcher.dispatch(Argument.any(), HttpServerEvents.CONTROLLER_ARGUMENTS).willReturn();
        this._dispatcher.dispatch(Argument.any(), HttpServerEvents.VIEW).willReturn();

        this._resolver = this.prophesize(ControllerResolverInterface);

        this._handler = new RequestHandler(this._dispatcher.reveal(), this._resolver.reveal());
    }

    async testShouldDispatchRequestEvent() {
        const req = new Request('/');

        this._dispatcher.dispatch(Argument.type(Event.RequestEvent), HttpServerEvents.REQUEST)
            .shouldBeCalled()
            .will(e => {
                expect(e.request).to.be.equal(req);
                e.response = new Response();
            });

        await this._handler.handle(req, false);
    }

    async testShouldThrowIfControllerResolverReturnsNoResult() {
        const req = new Request('/');
        this._resolver.getController(req).willReturn(false);

        this.expectExceptionMessageRegex(/Unable to find the controller for path ".+"\. The route is wrongly configured\./);
        await this._handler.handle(req, false);
    }

    async testShouldDispatchControllerEventAndCanBeChanged() {
        const req = new Request('/');
        const controller = () => {
            throw new Error('This should not be called');
        };
        const controller2 = () => new Response();

        this._dispatcher.dispatch(Argument.type(Event.ControllerEvent), HttpServerEvents.CONTROLLER)
            .shouldBeCalled()
            .will(e => {
                expect(e.request).to.be.equal(req);
                expect(e.controller).to.be.equal(controller);

                e.controller = controller2;
            });

        this._resolver.getController(req).willReturn(controller);

        expect(await this._handler.handle(req, false)).to.be.instanceOf(Response);
    }

    async testShouldDispatchViewEventIfControllerDoesNotReturnAResponse() {
        const req = new Request('/');
        const controller = () => {
            return 'foobar';
        };

        this._dispatcher.dispatch(Argument.type(Event.ViewEvent), HttpServerEvents.VIEW)
            .shouldBeCalled()
            .will(e => {
                expect(e.request).to.be.equal(req);
                expect(e.controllerResult).to.be.equal('foobar');

                e.response = new Response(e.controllerResult);
            });

        this._resolver.getController(req).willReturn(controller);

        expect(await this._handler.handle(req, false)).to.be.instanceOf(Response);
    }

    async testShouldThrowIfControllerDoesNotReturnAResponse() {
        const req = new Request('/');
        const controller = () => {};

        this._resolver.getController(req).willReturn(controller);

        this.expectException(LogicException);
        this.expectExceptionMessageRegex(/The controller must return a response\. Did you forget to add a return statement somewhere in your controller\?/);
        await this._handler.handle(req, false);
    }

    async testShouldThrowIfTimeoutReached() {
        this._handler.requestTimeoutMs = 1000;

        const req = new Request('/');
        const controller = async () => {
            await __jymfony.sleep(3000);
        };

        this._resolver.getController(req).willReturn(controller);

        this.expectException(RequestTimeoutException);
        await this._handler.handle(req, false);
    }

    async testShouldHandleExceptionsAndDispatchExceptionEvent() {
        const req = new Request('/');
        const controller = () => {};

        this._dispatcher.dispatch(Argument.type(Event.ExceptionEvent), HttpServerEvents.EXCEPTION)
            .shouldBeCalled()
            .will(e => {
                e.response = new Response(null, Response.HTTP_INTERNAL_SERVER_ERROR);
            });

        this._resolver.getController(req).willReturn(controller);
        const response = await this._handler.handle(req);

        expect(response.statusCode).to.be.equal(500);
    }

    async testShouldThrowExceptionIfNoListenerSetsAResponse() {
        const req = new Request('/');
        const error = new Error('TEST');
        const controller = () => {
            throw error;
        };

        this._dispatcher.dispatch(Argument.type(Event.ExceptionEvent), HttpServerEvents.EXCEPTION).shouldBeCalled();
        this._resolver.getController(req).willReturn(controller);

        try {
            await this._handler.handle(req);
            this.fail();
        } catch (e) {
            expect(e).to.be.equal(error);
        }
    }

    async testShouldSetCorrectResponseCodeOnHttpExceptions() {
        const req = new Request('/');
        const controller = () => {
            throw new AccessDeniedHttpException('Fobidden.');
        };

        this._dispatcher.dispatch(Argument.type(Event.ExceptionEvent), HttpServerEvents.EXCEPTION)
            .shouldBeCalled()
            .will(e => {
                e.response = new Response(e.exception.message);
            });

        this._resolver.getController(req).willReturn(controller);
        const response = await this._handler.handle(req);

        expect(response.statusCode).to.be.equal(403);
    }
}
