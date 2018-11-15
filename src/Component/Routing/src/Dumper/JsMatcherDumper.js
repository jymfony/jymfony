const StaticPrefixCollection = Jymfony.Component.Routing.Dumper.StaticPrefixCollection;
const RouteCollection = Jymfony.Component.Routing.RouteCollection;

const firstChars = 'abcdefghijklmnopqrstuvwxyz';
const nonFirstChars = 'abcdefghijklmnopqrstuvwxyz0123456789';

/**
 * PhpMatcherDumper creates a PHP class able to match URLs for a given set of routes.
 *
 * @memberOf Jymfony.Component.Routing.Dumper
 */
class JsMatcherDumper {
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

        /**
         * @type {string}
         *
         * @private
         */
        this._regexList = '';

        /**
         * @type {int}
         *
         * @private
         */
        this._variableCount = 0;
    }

    /**
     * Dumps a set of routes to a JS class.
     *
     * Available options:
     *
     *  * class:      The class name
     *  * base_class: The base class name
     *
     * @param {Object} options An array of options
     *
     * @returns {string} A JS class representing the matcher class
     */
    dump(options = {}) {
        options = Object.assign({
            'class': 'ProjectUrlMatcher',
            'base_class': 'Jymfony.Component.Routing.Matcher.Matcher',
        }, options);

        const matchMethod = this._generateMatchMethod();

        return `
const Request = Jymfony.Component.HttpFoundation.Request;
const MethodNotAllowedException = Jymfony.Component.Routing.Exception.MethodNotAllowedException;
const ResourceNotFoundException = Jymfony.Component.Routing.Exception.ResourceNotFoundException;

const regexList = {${this._regexList}};

/**
 * This class has been auto-generated
 * by the Jymfony Routing Component.
 */
class ${options['class']} extends ${options['base_class']} {
${matchMethod}
}

module.exports = ${options['class']};
`;
    }

    /**
     * Generates the code for the match method implementing UrlMatcherInterface.
     */
    _generateMatchMethod() {
        // Group hosts by same-suffix, re-order when possible
        let matchHost = false;
        let routes = new StaticPrefixCollection();

        for (const [ name, route ] of __jymfony.getEntries(this._routes.all())) {
            let host = route.host;
            if (host) {
                matchHost = true;
                host = '/' + __jymfony.strtr(host.split('').reverse().join(''), {
                    '}': '(',
                    '.': '/',
                    '{': ')',
                });
            }

            routes.addRoute(host || '/(.*)', [ name, route ]);
        }

        routes = matchHost ? routes.populateCollection(new RouteCollection()) : this._routes;
        let code = __jymfony.rtrim(this._compileRoutes(routes, matchHost), '\n');

        code = ` {
        const pathinfo = decodeURIComponent(request.pathInfo);
        const host = request.host.toLowerCase();
        const scheme = request.scheme;
        
        let ret, requiredHost, requiredMethods, requiredSchemes, hasRequiredScheme;

        const requestMethod = request.method;
        let canonicalMethod = request.method;
        if (Request.METHOD_HEAD === canonicalMethod) {
            canonicalMethod = Request.METHOD_GET;
        }

${code}

`;

        return `
    matchRequest(request)
    {
        const allow = new Set();
        const allowSchemes = new Set();
        let ret;

        if (ret = this._doMatch(request, allow, allowSchemes)) {
            return ret;
        }

        if (allow.size) {
            throw new MethodNotAllowedException([ ...allow ]);
        }

        let pathinfo = request.pathInfo;
        const requestMethod = request.method;
        if (Request.METHOD_HEAD !== requestMethod || Request.METHOD_GET !== requestMethod) {
            // no-op
        } else {
            while(true) {
                if (allowSchemes.size) {
                    if (ret = this._doMatch(request)) {
                        return Object.assign({}, this.redirect(request, pathinfo, ret._route, request.scheme), ret);
                    }
                } else if ('/' !== pathinfo) {
                    pathinfo = '/' !== pathinfo[-1] ? pathinfo + '/' : pathinfo.substr(0, -1);
                    if (ret = this._doMatch(pathinfo, allow, allowSchemes)) {
                        return Object.assign({}, this.redirect(request, pathinfo, ret._route), ret);
                    }
                    if (allowSchemes.size) {
                        continue;
                    }
                }

                break;
            }
        }

        throw new ResourceNotFoundException(__jymfony.sprintf('No routes found for "%s".', pathinfo));
    }

    _doMatch(request, allow = new Set(), allowSchemes = new Set())`
        +code+'\n        return null;\n    }';

    }

    /**
     * Generates Js code to match a RouteCollection with all its routes.
     *
     * @param {Jymfony.Component.Routing.RouteCollection} routes
     * @param {boolean} matchHost
     */
    _compileRoutes(routes, matchHost) {
        const [ staticRoutes, dynamicRoutes ] = this._groupStaticRoutes(routes);

        let code = this._compileStaticRoutes(staticRoutes, matchHost);
        code += this._compileDynamicRoutes(dynamicRoutes, matchHost);

        // Used to display the Welcome Page in apps that don't define a homepage
        code += '        if (\'/\' === pathinfo && ! allow.size && ! allowSchemes.size) {\n';
        code += '            throw new Jymfony.Component.Routing.Exception.NoConfigurationException();\n';
        code += '        }\n';

        return code;
    }

    /**
     * Splits static routes from dynamic routes, so that they can be matched first, using a simple switch.
     *
     * @param {Jymfony.Component.Routing.RouteCollection} collection
     */
    _groupStaticRoutes(collection) {
        const staticRoutes = {};
        const dynamicRegex = [];
        const dynamicRoutes = new RouteCollection();

        begin: for (const [ name, route ] of __jymfony.getEntries(collection.all())) {
            const compiledRoute = route.compile();
            const hostRegex = compiledRoute.hostRegex;
            const regex = compiledRoute.regex;

            if (0 === compiledRoute.pathVariables.length) {
                const host = 0 === compiledRoute.hostVariables.length ? route.host : '';
                const url = route.path;

                for (const [ hostRx, rx ] of dynamicRegex) {
                    if (url.match(rx) && (! host || ! hostRx || host.match(hostRx))) {
                        dynamicRegex.push([ hostRegex, regex ]);
                        dynamicRoutes.add(name, route);
                        continue begin;
                    }
                }

                if (! staticRoutes[url]) {
                    staticRoutes[url] = {};
                }

                staticRoutes[url][name] = route;
            } else {
                dynamicRegex.push([ hostRegex, regex ]);
                dynamicRoutes.add(name, route);
            }
        }

        return [ staticRoutes, dynamicRoutes ];
    }

    /**
     * Compiles static routes in a switch statement.
     *
     * Condition-less paths are put in a static array in the switch's default, with generic matching logic.
     * Paths that can match two or more routes, or have user-specified conditions are put in separate switch's cases.
     *
     * @param {Object.<string, Object.<string, Jymfony.Component.Routing.Route>>} staticRoutes
     * @param {boolean} matchHost
     *
     * @throws {LogicException}
     */
    _compileStaticRoutes(staticRoutes, matchHost) {
        if (! Object.keys(staticRoutes).length) {
            return '';
        }

        let code = '';
        let $default = '';

        for (const [ url, routes ] of __jymfony.getEntries(staticRoutes)) {
            if (1 === Object.keys(routes).length) {
                let name = Object.keys(routes)[0];
                const route = Object.values(routes)[0];

                if (! route.condition) {
                    const defaults = route.defaults;
                    if (defaults._canonical_route) {
                        name = defaults._canonical_route;
                        delete defaults._canonical_route;
                    }

                    let host;
                    if (0 === route.compile().hostVariables.length) {
                        host = __self.export(route.host);
                    } else {
                        host = route.compile().hostRegex;
                        if (host) {
                            host = 'new RegExp(' + __self.export(host.source) + ', \'i\')';
                        } else {
                            host = __self.export(undefined);
                        }
                    }

                    $default += __jymfony.sprintf(
                        '%s: [%s, %s, %s, %s],\n',
                        __self.export(url),
                        __self.export(Object.assign({}, defaults, { _route: name })),
                        host,
                        __self.export(route.methods),
                        __self.export(route.schemes)
                    );
                    continue;
                }
            }

            code += __jymfony.sprintf('        case %s:\n', __self.export(url));
            for (const [ name, route ] of __jymfony.getEntries(routes)) {
                code += this._compileRoute(route, name, true);
            }
            code += '            break;\n';
        }

        if ($default) {
            code += `
        default:
            const routes = {
${this._indent($default, 4)}            };

            if (! routes[pathinfo]) {
                break;
            }

            [ ret, requiredHost, requiredMethods, requiredSchemes ] = routes[pathinfo];
${this._compileSwitchDefault(false, matchHost)}
`;
        }

        return __jymfony.sprintf('        let hostMatches;\n        switch (pathinfo) {\n%s        }\n\n', this._indent(code));
    }

    /**
     * Compiles a regular expression followed by a switch statement to match dynamic routes.
     *
     * The regular expression matches both the host and the pathinfo at the same time. For stellar performance,
     * it is built as a tree of patterns, with re-ordering logic to group same-prefix routes together when possible.
     *
     * Patterns are named so that we know which one matched (https://pcre.org/current/doc/html/pcre2syntax.html#SEC23).
     * This name is used to "switch" to the additional logic required to match the final route.
     *
     * Condition-less paths are put in a static array in the switch's default, with generic matching logic.
     * Paths that can match two or more routes, or have user-specified conditions are put in separate switch's cases.
     *
     * Last but not least:
     *  - Because it is not possibe to mix unicode/non-unicode patterns in a single regexp, several of them can be generated.
     *  - The same regexp can be used several times when the logic in the switch rejects the match. When this happens, the
     *    matching-but-failing subpattern is blacklisted by replacing its name by "(*F)", which forces a failure-to-match.
     *    To ease this backlisting operation, the name of subpatterns is also the string offset where the replacement should occur.
     *
     * @param {Jymfony.Component.Routing.RouteCollection} collection
     * @param {boolean} matchHost
     */
    _compileDynamicRoutes(collection, matchHost) {
        if (! collection.length) {
            return '';
        }

        this._variableCount = 0;
        let code = '';
        const state = {
            'regex': '',
            'switch': '',
            'default': '',
            'mark': 0,
            'markTail': 0,
            'hostVars': {},
            'vars': {},
            getVars: (...m) => {
                if ('_route' === m[1]) {
                    return ' || ';
                }

                const varName = this._getNextVariableName();
                state.vars[varName] = m[1];
                return '?<'+varName+'>';
            },
        };

        let prev = null;
        const perModifiers = [];
        let routes;

        for (const [ name, route ] of __jymfony.getEntries(collection.all())) {
            const rx = route.compile().regex;
            if (prev !== rx.flags && route.compile().pathVariables) {
                routes = new RouteCollection();
                perModifiers.push([ rx.flags, routes ]);
                prev = rx.flags;
            }

            routes.add(name, route);
        }

        for (let [ modifiers, routes ] of perModifiers) {
            let prev = false;
            const perHost = [];
            for (const [ name, route ] of __jymfony.getEntries(routes.all())) {
                const regex = route.compile().hostRegex;
                if (prev !== '' + regex) {
                    routes = new RouteCollection();
                    perHost.push([ regex, routes ]);
                    prev = '' + regex;
                }

                routes.add(name, route);
            }

            prev = false;
            let rx = '^(?:';
            code += `\n    ${state.mark}: new RegExp(${__self.export(rx)}`;
            state.mark += rx.length;
            state.regex = rx;

            for (let [ hostRegex, routes ] of perHost) {
                if (matchHost) {
                    if (hostRegex) {
                        rx = hostRegex.toString().match(/^.\^(.*)\$.[a-zA-Z]*$/);
                        state.vars = {};

                        hostRegex = (prev ? '|' : '') +
                            '(?:' + rx[1].toLowerCase().replace(/\?<([^>]+)>/g, state.getVars) + ')\.';
                        state.hostVars = Object.assign({}, state.vars);
                    } else {
                        hostRegex = '(?:(?:[^./]*+\.)+)';
                        state.hostVars = {};
                    }

                    state.mark = (rx = (prev ? ')' : '') + hostRegex + '(?:').length;
                    code += '\n        +' + __self.export(rx);
                    state.regex += rx;
                    prev = true;
                }

                const tree = new StaticPrefixCollection();
                for (const [ name, route ] of __jymfony.getEntries(routes.all())) {
                    const rx = route.compile().regex.toString().match(/^.\^(.*)\$.[a-zA-Z]*$/);

                    state.vars = {};
                    const regex = rx[1].replace(/\?<([^>]+)>/g, state.getVars);
                    tree.addRoute(regex, [ name, regex, state.vars, route ]);
                }

                code += this._compileStaticPrefixCollection(tree, state);
            }
            if (matchHost) {
                code += '\n        +\')\'';
                state.regex += ')';
            }

            rx = ')$';
            code += `\n    +'${rx}', '${modifiers}'),\n`;
            state.regex += rx;
            state.markTail = 0;
        }

        if (state['default']) {
            state.switch += `
        default:
            const routes = {
${this._indent(state['default'], 4)}            };

            const [ret, vars, requiredMethods, requiredSchemes] = routes[m];
${this._compileSwitchDefault(true, matchHost)}
`;
        }

        const matchedPathinfo = matchHost ? 'host+\'.\'+pathinfo' : 'pathinfo';
        delete state.getVars;

        this._regexList = code;

        return `
        const matchFunc = (str, regex) => {
            regex.lastIndex = 0;
            const matches = str.match(regex);
            const res = {};

            if (! matches) {
                return res;
            }

            const marks = [];

            for (const [ k, v ] of __jymfony.getEntries(matches.groups)) {
                if (0 === k.indexOf('MARK_') && undefined !== v) {
                    marks.push(~~(k.replace('MARK_', '')));
                } else {
                    res[k] = v;
                }
            }

            res.MARK = marks.sort()[marks.length - 1];
            return res;
        };

        const matchedPathInfo = ${matchedPathinfo};

        for (let [offset, regex] of __jymfony.getEntries(regexList)) {
            let matches = matchFunc(matchedPathInfo, regex);
            while (0 < Object.keys(matches).length) {
                const m = matches.MARK;
                switch (m) {
${this._indent(state.switch, 3)}                }

                if (${state.mark} === m) {
                    break;
                }

                regex = __jymfony.substr_replace(regex, 'F', m - offset, 1 + m.length);
                offset += m.length;
            }
        }

`;
    }

    /**
     * Compiles a regexp tree of subpatterns that matches nested same-prefix routes.
     *
     * @param {Jymfony.Component.Routing.Dumper.StaticPrefixCollection} tree
     * @param {Object} state A simple state object that keeps track of the progress of the compilation,
     *                       and gathers the generated switch's "case" and "default" statements
     * @param {int} [prefixLen = 0]
     *
     * @returns {string}
     */
    _compileStaticPrefixCollection(tree, state, prefixLen = 0) {
        let code = '';
        let prevRegex = null;
        const routes = tree.routes;

        for (let [ i, route ] of __jymfony.getEntries(routes)) {
            if (route instanceof StaticPrefixCollection) {
                prevRegex = null;
                const prefix = route.prefix.substr(prefixLen);
                const rx = prefix + '(?:';
                state.mark += rx.length;
                code += '\n        +' + __self.export(rx);
                state.regex += rx;
                code += this._indent(this._compileStaticPrefixCollection(route, state, prefixLen + prefix.length));
                code += '\n        +\')\'';
                state.regex += ')';
                ++state.markTail;
                continue;
            }

            let name, regex, vars;
            [ name, regex, vars, route ] = route;
            const compiledRoute = route.compile();

            if (compiledRoute.regex === prevRegex) {
                state.switch = __jymfony.substr_replace(state.switch, this._compileRoute(route, name, false) + '\n', -19, 0);
                continue;
            }

            state.mark += 3 + state.markTail + regex.length - prefixLen;
            state.markTail = 2 + state.mark;
            const prev = '' !== code;
            const rx = __jymfony.sprintf((prev ? '|' : '') + '%s(?<MARK_%s>)', regex.substr(prefixLen), state.mark);
            code += '\n       + '+__self.export(rx);
            state.regex += rx;
            vars = Object.assign({}, state.hostVars, vars);

            let next;
            if (! route.condition && (! isArray(next = routes[1 + i] || null) || regex !== next[1])) {
                prevRegex = null;
                const $defaults = route.defaults;

                if ($defaults._canonical_route) {
                    name = $defaults._canonical_route;
                    delete $defaults._canonical_route;
                }

                state['default'] += __jymfony.sprintf(
                    '%s: [%s, %s, %s, %s],\n',
                    state.mark,
                    __self.export(Object.assign({'_route': name}, $defaults)),
                    __self.export(vars),
                    __self.export(route.methods),
                    __self.export(route.schemes)
                );
            } else {
                prevRegex = compiledRoute.regex.toString();
                let combine = '            matches = {';
                for (const [ j, m ] of __jymfony.getEntries(vars)) {
                    combine += __jymfony.sprintf('%s: matches[%d] || undefined, ', __self.export(m), 1 + j);
                }
                combine = Object.keys(vars).length ? __jymfony.substr_replace(combine, ');\n\n', -2) : '';

                state.switch += `
        case ${state.mark}:
${combine}${this._compileRoute(route, name, false)}
            break;

`;
            }
        }

        return code;
    }

    /**
     * A simple helper to compiles the switch's "default" for both static and dynamic routes.
     *
     * @param {boolean} hasVars
     * @param {boolean} matchHost
     */
    _compileSwitchDefault(hasVars, matchHost) {
        let code;
        if (hasVars) {
            code = `
            for (const [i, v] of __jymfony.getEntries(vars)) {
                if (undefined !== matches[i]) {
                    ret[v] = matches[i];
                }
            }
`;
        } else if (matchHost) {
            code = `
            if (requiredHost) {
                let hostMatches;
                if (isString(requiredHost) ? requiredHost !== host : ! (hostMatches = host.match(requiredHost))) {
                    break;
                }
                if (hostMatches) {
                    hostMatches['_route'] = ret['_route'];
                    ret = Object.assign({}, Object.filter(hostMatches.groups, v => undefined !== v), ret);
                }
            }
`;
        } else {
            code = '';
        }

        code += `
            const hasRequiredScheme = 0 === requiredSchemes.length || -1 !== requiredSchemes.indexOf(request.scheme);
            if (0 !== requiredMethods.length && -1 === requiredMethods.indexOf(canonicalMethod) && -1 === requiredMethods.indexOf(requestMethod)) {
                if (hasRequiredScheme) {
                    requiredMethods.forEach(allow.add, allow);
                }
                break;
            }
            if (! hasRequiredScheme) {
                requiredSchemes.forEach(allowSchemes.add, allowSchemes);
                break;
            }

            return ret;

`;

        return code;
    }

    /**
     * Compiles a single Route to JS code used to match it against the path info.
     *
     * @param {Jymfony.Component.Routing.Route} route
     * @param {string} name
     * @param {boolean} checkHost
     *
     * @returns {string}
     *
     * @throws {LogicException}
     */
    _compileRoute(route, name, checkHost) {
        let code = '';
        const compiledRoute = route.compile();

        let conditions = [];
        const matches = 0 !== compiledRoute.pathVariables.length;
        const hostMatches = 0 !== compiledRoute.hostVariables.length;
        let methods = route.methods;

        if (route.condition) {
            // TODO
            // $expression = $this->getExpressionLanguage()->compile($route->getCondition(), array('context', 'request'));
            //
            // If (false !== strpos($expression, '$request')) {
            //     $conditions[] = '($request = $request ?? $this->request ?: $this->createRequest($pathinfo))';
            // }
            // $conditions[] = $expression;
        }

        if (! checkHost || ! compiledRoute.hostRegex) {
            // No-op
        } else if (hostMatches) {
            conditions.push(__jymfony.sprintf('hostMatches = host.match(%s)', __self.export(compiledRoute.hostRegex)));
        } else {
            conditions.push(__jymfony.sprintf('%s === host', __self.export(route.host)));
        }

        conditions = conditions.join(' && ');

        if (conditions) {
            code += `
        // ${name}
        if (${conditions}) {
`;
        } else {
            code += `            // ${name}\n`;
        }

        // The offset where the return value is appended below, with indendation
        const retOffset = 12 + code.length;
        const $defaults = route.defaults;
        if ($defaults._canonical_route) {
            name = $defaults._canonical_route;
            delete $defaults._canonical_route;
        }

        // Optimize parameters array
        if (matches || hostMatches) {
            const vars = [ '{ \'_route\': \'' + name + '\'}' ];
            if (matches || (hostMatches && ! checkHost)) {
                vars.push('Object.filter(matches, v => undefined !== v)');
            }
            if (hostMatches && checkHost) {
                vars.push('Object.filter(hostMatches, v => undefined !== v)');
            }

            code += __jymfony.sprintf(
                '            ret = Object.assign({}, %s, %s);\n',
                vars.join(', '),
                __self.export($defaults)
            );
        } else if (Object.keys($defaults).length) {
            code += __jymfony.sprintf('            ret = %s;\n', __self.export(Object.assign({'_route': name}, $defaults)));
        } else {
            code += __jymfony.sprintf('            ret = {\'_route\': \'%s\'};\n', name);
        }

        let methodVariable;
        if (0 < methods.length) {
            methodVariable = -1 !== methods.indexOf('GET') ? 'canonicalMethod' : 'requestMethod';
            methods = __self.export(methods);
        }

        let schemes = route.schemes;
        if (0 < schemes.length) {
            schemes = __self.export(schemes);
            if (0 < methods.length) {
                code += `
            requiredSchemes = ${schemes};
            hasRequiredScheme = -1 !== requiredSchemes.indexOf(request.scheme);
            
            if (-1 === ${methods}.indexOf(${methodVariable})) {
                if (hasRequiredScheme) {
                    ${methods}.forEach(allow.add, allow);
                }
            } else if (! hasRequiredScheme) {
                requiredSchemes.forEach(allowSchemes.add, allowSchemes);
            } else
`;
            } else {
                code += `
            requiredSchemes = ${schemes};
            if (-1 === requiredSchemes.indexOf(request.scheme)) {
                requiredSchemes.forEach(allowSchemes.add, allowSchemes);
            } else
`;
            }
        } else if (methods.length) {
            code += `
            if (-1 === ${methods}.indexOf(${methodVariable})) {
                ${methods}.forEach(allow.add, allow);
            } else
`;
        }

        if (0 < schemes.length || 0 < methods.length) {
            code += '                return ret;\n';
        } else {
            code = __jymfony.substr_replace(code, 'return', retOffset, 6);
        }

        if (0 < conditions.length) {
            code += '        }\n';
        } else if (0 < schemes.length || 0 < methods.length) {
            code += '    ';
        }

        return conditions ? this._indent(code) : code;
    }

    _indent(code, level = 1) {
        return code.replace(/^./mg, ($) => '    '.repeat(level) + $[0]);
    }

    /**
     * @internal
     */
    static export(value) {
        if (null === value) {
            return 'null';
        }

        if (undefined === value) {
            return 'undefined';
        }

        if (isRegExp(value)) {
            value = value.toString();
        }

        if (isScalar(value) || isArray(value) || isObjectLiteral(value)) {
            if (__jymfony.equal(JSON.parse(JSON.stringify(value)), value)) {
                return JSON.stringify(value);
            }
        }

        throw new InvalidArgumentException('Jymfony.Component.Routing.Route cannot contain objects.');
    }

    /**
     * @returns {string}
     *
     * @private
     */
    _getNextVariableName() {
        let name = '';
        let i = this._variableCount;

        if ('' === name) {
            name += firstChars[i % firstChars.length];
            i = ~~(i / firstChars.length);
        }

        while (0 < i) {
            --i;
            name += nonFirstChars[i % nonFirstChars.length];
            i = ~~(i / nonFirstChars.length);
        }

        ++this._variableCount;
        return name;
    }
}

module.exports = JsMatcherDumper;
