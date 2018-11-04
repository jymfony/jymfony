/**
 * RequestMatcherInterface is an interface for strategies to match a Request.
 *
 * @memberOf Jymfony.Component.HttpFoundation
 */
class RequestMatcherInterface {
    /**
     * Decides whether the rule(s) implemented by the strategy matches the supplied request.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     *
     * @returns {boolean} true if the request matches, false otherwise
     */
    matches(request) { }
}

module.exports = getInterface(RequestMatcherInterface);
