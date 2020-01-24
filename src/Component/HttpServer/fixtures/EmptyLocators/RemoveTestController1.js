import { @Type } from '@jymfony/decorators';

const ClassNotInContainer = Jymfony.Component.HttpServer.Tests.Fixtures.EmptyLocators.ClassNotInContainer;

/**
 * @memberOf Jymfony.Component.HttpServer.Tests.Fixtures.EmptyLocators
 */
export default class RemoveTestController1 {
    fooAction(@Type(Object) bar, @Type(ClassNotInContainer) baz) {
    }
}
