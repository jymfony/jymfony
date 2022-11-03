const Type = Jymfony.Component.Autoloader.Decorator.Type;

/**
 * @memberOf Jymfony.Component.HttpServer.Tests.Fixtures.RegisterControllers
 */
export default class NonExistentClassOptionalController {
    barAction(@Type('Jymfony.Component.HttpServer.Tests.Fixtures.RegisterControllers.NonExistentClass') bar = null) {
    }

    fooAction(@Type('Jymfony.Component.HttpServer.Tests.Fixtures.RegisterControllers.NonExistentClass') bar = null, baz) {
    }
}
