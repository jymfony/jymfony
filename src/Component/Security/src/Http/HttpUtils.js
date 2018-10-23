const MethodNotAllowedException = Jymfony.Component.Routing.Exception.MethodNotAllowedException;
const ResourceNotFoundException = Jymfony.Component.Routing.Exception.ResourceNotFoundException;

const url = require('url');

/**
 * @memberOf Jymfony.Component.Security.Http
 */
class HttpUtils {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Routing.Generator.UrlGeneratorInterface} urlGenerator
     * @param {Jymfony.Component.Routing.Matcher.MatcherInterface} matcher
     */
    __construct(urlGenerator, matcher) {
        /**
         * @type {Jymfony.Component.Routing.Generator.UrlGeneratorInterface}
         *
         * @private
         */
        this._urlGenerator = urlGenerator;

        /**
         * @type {Jymfony.Component.Routing.Matcher.MatcherInterface}
         *
         * @private
         */
        this._matcher = matcher;
    }

    /**
     * Checks that a given path matches the Request.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request A Request instance
     * @param {string} path A path (an absolute path (/foo), an absolute URL (http://...), or a route name (foo))
     *
     * @returns {boolean} true if the path is the same as the one from the Request, false otherwise
     */
    checkRequestPath(request, path) {
        if ('/' !== path[0]) {
            try {
                const parameters = this._matcher.matchRequest(request);

                return path === parameters._route;
            } catch (e) {
                if (e instanceof MethodNotAllowedException || e instanceof ResourceNotFoundException) {
                    return false;
                }

                throw e;
            }
        }

        return path === decodeURIComponent(request.pathInfo);
    }

    /**
     * Generates a URI, based on the given path or absolute URL.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request A Request instance
     * @param {string} path A path (an absolute path (/foo), an absolute URL (http://...), or a route name (foo))
     *
     * @returns {string} An absolute URL
     *
     * @throws {LogicException}
     */
    generateUri(request, path) {
        if (! path) {
            return path;
        }

        const parsed = url.parse(path);
        if (parsed.protocol) {
            return path;
        }

        if ('/' === path[0]) {
            return request.schemeAndHttpHost + path;
        }

        return this._urlGenerator.withContext(request).generate(path);
    }
}

module.exports = HttpUtils;
