/**
 * @memberOf Jymfony.Component.HttpFoundation.Controller
 */
class ControllerResolverInterface {
    /**
     * Returns the Controller instance associated with a Request.
     *
     * As several resolvers can exist for a single application, a resolver must
     * return false when it is not able to determine the controller.
     *
     * The resolver must only throw an exception when it should be able to load
     * controller but cannot because of some errors made by the developer.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     *
     * @returns {Function|false} A function representing the Controller,
     *    or false if this resolver is not able to determine the controller
     *
     * @throws {LogicException} If the controller can't be found
     */
    getController(request) { }
}

export default getInterface(ControllerResolverInterface);
