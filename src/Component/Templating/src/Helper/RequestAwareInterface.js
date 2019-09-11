/**
 * Represents an helper accepting a request context.
 *
 * @memberOf Jymfony.Component.Templating.Helper
 */
class RequestAwareInterface {
    /**
     * Sets the request.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     *
     * @returns {Jymfony.Component.Templating.Helper.RequestAwareInterface}
     */
    withRequest(request) { }
}

export default getInterface(RequestAwareInterface);
