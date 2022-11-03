const ClassNotInContainer = Jymfony.Component.HttpServer.Tests.Fixtures.EmptyLocators.ClassNotInContainer;
const Type = Jymfony.Component.Autoloader.Decorator.Type;

/**
 * @memberOf Jymfony.Component.HttpServer.Tests.Fixtures.EmptyLocators
 */
export default class RemoveTestController1 {
    fooAction(@Type(Object) bar, @Type(ClassNotInContainer) baz) {
    }
}
