/**
 * Represents an helper accepting a request context.
 *
 * @memberOf Jymfony.Component.Templating.Helper
 */
class ResponseAwareInterface {
    /**
     * Sets the request.
     *
     * @param {Jymfony.Component.HttpFoundation.Response} response
     *
     * @returns {Jymfony.Component.Templating.Helper.ResponseAwareInterface}
     */
    withResponse(response) { }
}

export default getInterface(ResponseAwareInterface);
