/**
 * Responsible for resolving the value of an argument based on its metadata.
 *
 * @memberOf Jymfony.Component.HttpServer.Controller
 */
class ArgumentValueResolverInterface {
    /**
     * Whether this resolver can resolve the value for the given ReflectionParameter.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     * @param {ReflectionParameter} argument
     *
     * @returns {boolean}
     */
    supports(request, argument) { }

    /**
     * Returns the possible value(s).
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     * @param {ReflectionParameter} argument
     *
     * @returns {Iterable<*>|AsyncIterable<*>}
     */
    resolve(request, argument) { }
}

export default getInterface(ArgumentValueResolverInterface);
