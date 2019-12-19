import { @Type } from '@jymfony/decorators';

const ClassNotInContainer = Jymfony.Component.HttpServer.Tests.Fixtures.EmptyLocators.ClassNotInContainer;

/**
 * @memberOf Jymfony.Component.HttpServer.Tests.Fixtures.EmptyLocators
 */
export default class RemoveTestController2 {
    setSuite(@Type(Object) suite) {
    }

    fooAction(@Type(ClassNotInContainer) bar = null) {
    }
}
