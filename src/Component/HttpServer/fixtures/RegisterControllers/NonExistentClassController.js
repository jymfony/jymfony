const Type = Jymfony.Component.Autoloader.Decorator.Type;

/**
 * @memberOf Jymfony.Component.HttpServer.Tests.Fixtures.RegisterControllers
 */
export default class NonExistentClassController {
    fooAction(@Type('Jymfony.Component.HttpServer.Tests.Fixtures.RegisterControllers.NonExistentClass') bar) {
    }
}
