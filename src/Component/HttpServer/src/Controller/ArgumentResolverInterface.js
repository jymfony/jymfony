/**
 * An ArgumentResolverInterface instance knows how to determine the
 * arguments for a specific action.
 *
 * @memberOf Jymfony.Component.HttpServer.Controller
 */
class ArgumentResolverInterface {
    /**
     * Returns the arguments to pass to the controller.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     * @param {Function} controller
     *
     * @returns {*[]|Promise<*[]>} An array of arguments to pass to the controller
     *
     * @throws {RuntimeException} When no value could be provided for a required argument
     */
    getArguments(request, controller) { }
}

export default getInterface(ArgumentResolverInterface);
