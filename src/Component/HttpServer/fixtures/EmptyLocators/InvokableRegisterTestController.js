const Type = Jymfony.Component.Autoloader.Decorator.Type;

/**
 * @memberOf Jymfony.Component.HttpServer.Tests.Fixtures.EmptyLocators
 */
export default class InvokableRegisterTestController {
    __invoke(@Type(Object) bar) {
    }
}
