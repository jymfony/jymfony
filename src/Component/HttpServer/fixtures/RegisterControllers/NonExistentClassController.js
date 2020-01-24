import { @Type } from '@jymfony/decorators';

/**
 * @memberOf Jymfony.Component.HttpServer.Tests.Fixtures.RegisterControllers
 */
export default class NonExistentClassController {
    fooAction(@Type('Jymfony.Component.HttpServer.Tests.Fixtures.RegisterControllers.NonExistentClass') bar) {
    }
}
