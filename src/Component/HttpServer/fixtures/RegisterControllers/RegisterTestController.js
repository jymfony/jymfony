import { @Type } from '@jymfony/decorators';

const ControllerDummy = Jymfony.Component.HttpServer.Tests.Fixtures.RegisterControllers.ControllerDummy;

/**
 * @memberOf Jymfony.Component.HttpServer.Tests.Fixtures.RegisterControllers
 */
export default class RegisterTestController {
    __construct(@Type(ControllerDummy) bar) {
    }

    fooAction(@Type(ControllerDummy) bar) {
    }
}
