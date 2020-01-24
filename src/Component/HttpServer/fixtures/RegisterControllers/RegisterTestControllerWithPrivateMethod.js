import { @Type } from '@jymfony/decorators';

const ControllerDummy = Jymfony.Component.HttpServer.Tests.Fixtures.RegisterControllers.ControllerDummy;

/**
 * @memberOf Jymfony.Component.HttpServer.Tests.Fixtures.RegisterControllers
 */
export default class RegisterTestControllerWithPrivateMethod {
    __construct(@Type(ControllerDummy) bar) {
    }

    fooAction(@Type(ControllerDummy) bar) {
    }

    #barAction(@Type(ControllerDummy) bar) {
    }
}
