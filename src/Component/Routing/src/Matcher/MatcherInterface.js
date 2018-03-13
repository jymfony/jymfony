/**
 * Matcher for request objects.
 *
 * @memberOf Jymfony.Component.Routing.Matcher
 */
class MatcherInterface {
    /**
     * Tries to match a request with a set of routes.
     *
     * If the matcher can not find information, it must throw one of the exceptions documented
     * below.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     *
     * @returns {Object<string, *>} A set of parameters
     *
     * @throws {Jymfony.Component.Routing.Exception.NoConfigurationException} If no routing configuration could be found
     * @throws {Jymfony.Component.Routing.Exception.ResourceNotFoundException} If no matching resource could be found
     * @throws {Jymfony.Component.Routing.Exception.MethodNotAllowedException} If a matching resource was found but the request method is not allowed
     */
    matchRequest(request) { }
}

module.exports = getInterface(MatcherInterface);
