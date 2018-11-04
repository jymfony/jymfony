/**
 * Represents an url generator, which is capable to generate an url
 * (or part of it) for a given route/resource.
 *
 * @memberOf Jymfony.Component.Routing.Generator
 */
class UrlGeneratorInterface {
    /**
     * Returns a new url generator with context set for the given request.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     *
     * @returns {Jymfony.Component.Routing.Generator.UrlGeneratorInterface}
     */
    withContext(request) { }

    /**
     * Generates a URL or path for a specific route based on the given parameters.
     *
     * Parameters that reference placeholders in the route pattern will substitute them in the
     * path or host. Extra params are added as query string to the URL.
     *
     * When the passed reference type cannot be generated for the route because it requires a different
     * host or scheme than the current one, the method will return a more comprehensive reference
     * that includes the required params. For example, when you call this method with referenceType = ABSOLUTE_PATH
     * but the route requires the https scheme whereas the current scheme is http, it will instead return an
     * ABSOLUTE_URL with the https scheme and the current host. This makes sure the generated URL matches
     * the route in any case.
     *
     * The special parameter _fragment will be used as the document fragment suffixed to the final URL.
     *
     * @param {string} name
     * @param {Object<string, *>} parameters
     * @param {int} referenceType
     *
     * @returns {string}
     *
     * @throws {Jymfony.Component.Routing.Exception.RouteNotFoundException} If the named route doesn't exist
     * @throws {Jymfony.Component.Routing.Exception.MissingMandatoryParametersException} When some parameters are
     *      missing that are mandatory for the route
     * @throws {Jymfony.Component.Routing.Exception.InvalidParameterException} When a parameter value for a placeholder
     *      is not correct because it does not match the requirement
     */
    generate(name, parameters = {}, referenceType = __self.ABSOLUTE_PATH) { }
}

/**
 * Generates an absolute URL, e.g. "http://example.com/dir/file".
 */
UrlGeneratorInterface.ABSOLUTE_URL = 0;

/**
 * Generates an absolute path, e.g. "/dir/file".
 */
UrlGeneratorInterface.ABSOLUTE_PATH = 1;

/**
 * Generates a relative path based on the current request path, e.g. "../parent-file".
 *
 * @see UrlGenerator.getRelativePath()
 */
UrlGeneratorInterface.RELATIVE_PATH = 2;

/**
 * Generates a network path, e.g. "//example.com/dir/file".
 * Such reference reuses the current scheme but specifies the host.
 */
UrlGeneratorInterface.NETWORK_PATH = 3;

module.exports = getInterface(UrlGeneratorInterface);
