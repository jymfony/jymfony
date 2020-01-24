import { @Type } from '@jymfony/decorators';

/**
 * @memberOf Jymfony.Component.HttpServer.Tests.Fixtures.EmptyLocators
 */
export default class InvokableRegisterTestController {
    __invoke(@Type(Object) bar) {
    }
}
