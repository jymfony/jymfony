const Request = Jymfony.Component.HttpFoundation.Request;
const Exception = Jymfony.Component.Routing.Exception;
const MatcherInterface = Jymfony.Component.Routing.Matcher.MatcherInterface;

/**
 * Matches request based on a set of routes.
 *
 * @memberOf Jymfony.Component.Routing.Matcher
 */
class Matcher extends implementationOf(MatcherInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Routing.RouteCollection} routes
     */
    __construct(routes) {
        /**
         * @type {Jymfony.Component.Routing.RouteCollection}
         *
         * @private
         */
        this._routes = routes;
    }

    /**
     * @inheritdoc
     */
    matchRequest(request) {
        if (0 === this._routes.length && '/' === request.pathInfo) {
            throw new Exception.NoConfigurationException();
        }

        const pathinfo = request.pathInfo;
        const host = request.host;
        const scheme = request.scheme;

        const allow = new Set();
        const allowSchemes = new Set();

        let method = request.method;
        if (Request.METHOD_HEAD === method) {
            method = Request.METHOD_GET;
        }

        for (const [ name, route ] of this._routes) {
            const compiledRoute = route.compile();

            // Check the static prefix of the URL first. Only use the more expensive regex when it matches
            if ('' !== compiledRoute.staticPrefix && 0 !== pathinfo.indexOf(compiledRoute.staticPrefix)) {
                continue;
            }

            const matches = compiledRoute.regex.exec(pathinfo);
            if (! matches) {
                continue;
            }

            let hostMatches = [];
            if (undefined !== compiledRoute.hostRegex && ! (hostMatches = compiledRoute.hostRegex.exec(host))) {
                continue;
            }

            const hasRequiredSchemes = 0 === route.schemes.length || route.hasScheme(scheme);
            const requiredMethods = route.methods;
            if (-1 === requiredMethods.indexOf(method)) {
                if (hasRequiredSchemes) {
                    requiredMethods.forEach(m => allow.add(m));
                }

                continue;
            }

            if (! hasRequiredSchemes) {
                route.schemes.forEach(s => allowSchemes.add(s));

                continue;
            }

            return this._getAttributes(route, name, Object.assign({}, matches.groups, hostMatches.groups));
        }

        throw 0 < allow.size
            ? new Exception.MethodNotAllowedException([ ...allow ])
            : new Exception.ResourceNotFoundException(__jymfony.sprintf('No routes found for "%s".', pathinfo));
    }

    /**
     * Returns a set of values to use as request attributes.
     *
     * @param {Jymfony.Component.Routing.Route} route
     * @param {string} name
     * @param {Object.<string, string>} attributes
     *
     * @returns {Object.<string, *>}
     *
     * @protected
     */
    _getAttributes(route, name, attributes) {
        return Object.assign({
            _route: name,
        }, route.defaults, attributes);
    }
}

module.exports = Matcher;
