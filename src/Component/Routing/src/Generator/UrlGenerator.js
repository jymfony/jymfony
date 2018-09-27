const InvalidParameterException = Jymfony.Component.Routing.Exception.InvalidParameterException;
const MissingMandatoryParametersException = Jymfony.Component.Routing.Exception.MissingMandatoryParametersException;
const RouteNotFoundException = Jymfony.Component.Routing.Exception.RouteNotFoundException;
const UrlGeneratorInterface = Jymfony.Component.Routing.Generator.UrlGeneratorInterface;
const RequestContext = Jymfony.Component.Routing.RequestContext;

const qs = require('querystring');

const decodedChars = {
    '%2F': '/',
    '%40': '@',
    '%3A': ':',
    '%3B': ';',
    '%2C': ',',
    '%3D': '=',
    '%2B': '+',
    '%21': '!',
    '%2A': '*',
    '%7C': '|',
};

/**
 * UrlGenerator can generate a URL or a path for any route in the RouteCollection
 * based on the passed parameters.
 *
 * @memberOf Jymfony.Component.Routing.Generator
 */
class UrlGenerator extends implementationOf(UrlGeneratorInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Routing.RouteCollection} routeCollection
     * @param {Jymfony.Component.Routing.RequestContext} [context = new RequestContext()]
     * @param {string} [defaultLocale]
     */
    __construct(routeCollection, context = new RequestContext(), defaultLocale = undefined) {
        /**
         * @type {Jymfony.Component.Routing.RouteCollection}
         *
         * @private
         */
        this._routeCollection = routeCollection;

        /**
         * @type {Jymfony.Component.Routing.RequestContext}
         *
         * @private
         */
        this._context = context;

        /**
         * @type {string}
         *
         * @private
         */
        this._defaultLocale = defaultLocale;
    }

    /**
     * @inheritdoc
     */
    withContext(request) {
        const isSecure = request.isSecure;
        const context = new RequestContext(
            request.method,
            request.host,
            request.scheme,
            isSecure ? 80 : (request.port || 80),
            isSecure ? (request.port || 443) : 443,
            request.pathInfo,
            qs.stringify(request.query.all),
        );

        return new __self(this._routeCollection, context, this._defaultLocale);
    }

    /**
     * @inheritdoc
     */
    generate(name, parameters = {}, referenceType = UrlGeneratorInterface.ABSOLUTE_PATH) {
        let route = null;
        let locale = parameters._locale || this._context.getParameter('_locale') || this._defaultLocale;

        if (locale) {
            do {
                if ((route = this._routeCollection.get(name + '.' + locale)) && route.getDefault('_canonical_route') === name) {
                    delete parameters._locale;
                    break;
                }

                const idx = locale.indexOf('_');
                if (-1 === idx) {
                    break;
                }

                locale = locale.substr(idx);
            } while (locale);
        }

        if (undefined === (route = route || this._routeCollection.get(name))) {
            throw new RouteNotFoundException(__jymfony.sprintf('Unable to generate a URL for the named route "%s" as such route does not exist.', name));
        }

        const compiledRoute = route.compile();

        return this._doGenerate(
            compiledRoute.variables,
            route.defaults,
            compiledRoute.tokens,
            parameters,
            name,
            referenceType,
            compiledRoute.hostTokens,
            compiledRoute.schemes
        );
    }

    /**
     * Do generate an address from route components.
     *
     * @param {string[]} variables
     * @param {Object<string, string>} defaults
     * @param {string[][]} tokens
     * @param {Object<string, *>} parameters
     * @param {string} name
     * @param {int} referenceType
     * @param {string[][]} hostTokens
     * @param {string[]} requiredSchemes
     *
     * @returns {string}
     *
     * @private
     */
    _doGenerate(variables, defaults, tokens, parameters, name, referenceType, hostTokens, requiredSchemes = []) {
        const mergedParams = Object.assign({}, defaults, parameters);

        const diff = variables.filter(name => !mergedParams.hasOwnProperty(name));
        if (diff.length) {
            throw new MissingMandatoryParametersException(__jymfony.sprintf(
                'Some mandatory parameters are missing ("%s") to generate a URL for route "%s".',
                diff.join('", "'),
                name
            ));
        }

        let url = '';
        let optional = true;
        const message = 'Parameter "{parameter}" for route "{route}" must match "{expected}" ("{given}" given) to generate a corresponding URL.';

        for (const token of tokens) {
            if ('variable' === token[0]) {
                if (!optional || !defaults.hasOwnProperty(token[3]) || undefined !== mergedParams[token[3]] && String(mergedParams[token[3]]) !== String(defaults[token[3]])) {
                    const regex = new RegExp('^' + token[2] + '$', !!token[4] ? 'u' : '');
                    if (! regex.test(mergedParams[token[3]])) {
                        throw new InvalidParameterException(
                            __jymfony.strtr(message, {
                                '{parameter}': token[3],
                                '{route}': name,
                                '{expected}': token[2],
                                '{given}': mergedParams[token[3]],
                            })
                        );
                    }

                    url = token[1] + mergedParams[token[3]] + url;
                    optional = false;
                }
            } else {
                url = token[1] + url;
                optional = false;
            }
        }

        if ('' === url) {
            url = '/';
        }

        url = __jymfony.strtr(
            encodeURIComponent(url)
                .replace(/'/g, '%27')
                .replace(/\(/g, '%28')
                .replace(/\)/g, '%29'),
            decodedChars
        );

        // The path segments "." and ".." are interpreted as relative reference when resolving a URI; see http://tools.ietf.org/html/rfc3986#section-3.3
        // So we need to encode them as they are not used for this purpose here
        // Otherwise we would generate a URI that, when followed by a user agent (e.g. browser), does not match this route
        url = __jymfony.strtr(url, {'/../': '/%2E%2E/', '/./': '/%2E/'});
        if ('/..' === url.substr(-3)) {
            url = url.substr(0, -2) + '%2E%2E';
        } else if ('/.' === url.substr(-2)) {
            url = url.substr(0, -1) + '%2E';
        }

        let schemeAuthority = '';
        let host = this._context.host;
        if (!! host) {
            let scheme = this._context.scheme;
            if (requiredSchemes.length) {
                if (-1 === requiredSchemes.indexOf(scheme)) {
                    referenceType = UrlGenerator.ABSOLUTE_URL;
                    scheme = requiredSchemes[0];
                }
            }

            if (hostTokens.length) {
                let routeHost = '';
                for (const token of hostTokens) {
                    if ('variable' === token[0]) {
                        const regex = new RegExp('^' + token[2] + '$', !!token[4] ? 'u' : '');
                        if (! regex.test(mergedParams[token[3]])) {
                            throw new InvalidParameterException(
                                __jymfony.strtr(message, {
                                    '{parameter}': token[3],
                                    '{route}': name,
                                    '{expected}': token[2],
                                    '{given}': mergedParams[token[3]],
                                })
                            );
                        }

                        routeHost = token[1] + mergedParams[token[3]] + routeHost;
                    } else {
                        routeHost = token[1] + routeHost;
                    }
                }

                if (routeHost !== host) {
                    host = routeHost;
                    if (UrlGenerator.ABSOLUTE_URL !== referenceType) {
                        referenceType = UrlGenerator.NETWORK_PATH;
                    }
                }
            }

            if (UrlGenerator.ABSOLUTE_URL === referenceType || UrlGenerator.NETWORK_PATH === referenceType) {
                let port = '';
                if ('http' === scheme && 80 !== this._context.httpPort) {
                    port += ':' + this._context.httpPort;
                } else if ('https' === scheme && 443 !== this._context.httpsPort) {
                    port += ':' + this._context.httpsPort;
                }

                schemeAuthority = UrlGenerator.NETWORK_PATH === referenceType ? '//' : `${scheme}://`;
                schemeAuthority += host + port;
            }
        }

        if (UrlGenerator.RELATIVE_PATH === referenceType) {
            url = UrlGenerator.getRelativePath(this._context.pathinfo, url);
        } else {
            url = schemeAuthority + url;
        }

        // Add a query string if needed
        const extras = Object.keys(parameters)
            .filter(name => {
                if (-1 !== variables.indexOf(name)) {
                    return false;
                }

                if (Object.prototype.hasOwnProperty.call(defaults, name)) {
                    return __jymfony.equal(defaults[name], parameters[name], false);
                }

                return true;
            });

        // Extract fragment
        let fragment = '';
        if (defaults._fragment) {
            fragment = defaults._fragment;
        }

        let idx;
        if (-1 !== (idx = extras.indexOf('_fragment'))) {
            fragment = parameters._fragment;
            delete extras[idx];
        }

        if (extras.length) {
            const toHashTable = (obj) => {
                if (! isObjectLiteral(obj) && ! isArray(obj)) {
                    return obj;
                }

                const table = new HashTable();
                for (const [ k, v ] of __jymfony.getEntries(obj)) {
                    table.put(k, toHashTable(v));
                }

                return table;
            };

            const toQuery = (key, value, base = '') => {
                if (value instanceof HashTable) {
                    return [ ...value ]
                        .map(el => toQuery(el[0], el[1], base ? base + '[' + key + ']' : key))
                        .join('&');
                }

                return encodeURIComponent(base ? base + '[' + key + ']' : key) + '=' + encodeURIComponent(value);
            };

            const ht = toHashTable(Object.keys( parameters )
                .filter( key => -1 !== extras.indexOf(key) )
                .reduce( (res, key) => (res[key] = parameters[key], res), {} ));

            const query = Array.from(ht)
                .map(el => toQuery(el[0], el[1]))
                .join('&');

            url += '?' + __jymfony.strtr(query, {'%2F': '/'});
        }

        if ('' !== fragment) {
            fragment = encodeURIComponent(fragment)
                .replace(/!/g, '%21')
                .replace(/'/g, '%27')
                .replace(/\(/g, '%28')
                .replace(/\)/g, '%29')
                .replace(/\*/g, '%2A');

            url += '#' + __jymfony.strtr(fragment, {'%2F': '/', '%3F': '?'});
        }

        return url;
    }

    /**
     * Returns the target path as relative reference from the base path.
     *
     * Only the URIs path component (no schema, host etc.) is relevant and must be given, starting with a slash.
     * Both paths must be absolute and not contain relative parts.
     * Relative URLs from one resource to another are useful when generating self-contained downloadable document archives.
     * Furthermore, they can be used to reduce the link size in documents.
     *
     * Example target paths, given a base path of "/a/b/c/d":
     * - "/a/b/c/d"     -> ""
     * - "/a/b/c/"      -> "./"
     * - "/a/b/"        -> "../"
     * - "/a/b/c/other" -> "other"
     * - "/a/x/y"       -> "../../x/y"
     *
     * @param {string} basePath   The base path
     * @param {string} targetPath The target path
     *
     * @returns {string} The relative target path
     */
    static getRelativePath(basePath, targetPath) {
        if (basePath === targetPath) {
            return '';
        }

        const sourceDirs = ('/' === basePath.charAt(0) ? basePath.substr(1) : basePath).split('/');
        const targetDirs = ('/' === targetPath.charAt(0) ? targetPath.substr(1) : targetPath).split('/');

        sourceDirs.pop();
        const targetFile = targetDirs.pop();

        for (const [ i, dir ] of __jymfony.getEntries(sourceDirs)) {
            if (targetDirs[i] && dir === targetDirs[i]) {
                delete sourceDirs[i];
                delete targetDirs[i];
            } else {
                break;
            }
        }

        targetDirs.push(targetFile);
        const path = '../'.repeat(sourceDirs.length) + targetDirs.join('/');

        // A reference to the same base directory or an empty subdirectory must be prefixed with "./".
        // This also applies to a segment with a colon character (e.g., "file:colon") that cannot be used
        // As the first segment of a relative-path reference, as it would be mistaken for a scheme name
        // (see http://tools.ietf.org/html/rfc3986#section-4.2).
        let colonPos, slashPos;
        return '' === path || '/' === path.charAt(0) ||
            -1 !== (colonPos = path.indexOf(':')) &&
            (colonPos < (slashPos = path.indexOf('/')) || -1 === slashPos)
            ? `./${path}` : path;
    }
}

module.exports = UrlGenerator;
