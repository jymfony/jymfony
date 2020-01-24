import { @Type } from '@jymfony/decorators';

const Request = Jymfony.Component.HttpFoundation.Request;
const Session = Jymfony.Component.HttpFoundation.Session.Session;
const RequestInterface = Jymfony.Contracts.HttpFoundation.RequestInterface;

/**
 * @memberOf Jymfony.Component.HttpServer.Tests.Fixtures.ArgumentResolver
 */
export default class Controller {
    fooAction(@Type(RequestInterface) request) {
    }

    controllerWithoutArguments() {
    }

    controllerWithFoo(foo) {
    }

    controllerWithFooAndDefaultBar(foo, bar = null) {
    }

    controllerWithRequestInterface(@Type(RequestInterface) request) {
    }

    controllerWithSession(@Type(Session) session) {
    }

    controllerWithRequest(@Type(Request) request) {
    }

    __invoke(foo, bar = null) {
    }

    variadicAction(foo, ...bar) {
    }
}
