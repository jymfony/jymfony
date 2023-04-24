const ControllerDummy = Jymfony.Component.HttpServer.Tests.Fixtures.RegisterControllers.ControllerDummy;
const Type = Jymfony.Component.Autoloader.Decorator.Type;

/**
 * @memberOf Jymfony.Component.HttpServer.Tests.Fixtures.RegisterControllers
 */
export default class RegisterTestController {
    __construct(@Type(ControllerDummy) bar) {
    }

    fooAction(@Type(ControllerDummy) bar) {
    }
}
