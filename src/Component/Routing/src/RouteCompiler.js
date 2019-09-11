const CompiledRoute = Jymfony.Component.Routing.CompiledRoute;

const SEPARATORS = [
    '/', ',', ';', '.', ':', '-', '_', '~', '+', '*', '=', '@', '|',
];

/**
 * @memberOf Jymfony.Component.Routing
 */
export default class RouteCompiler {
    /**
     * Compiles a route.
     *
     * @param {Jymfony.Component.Routing.Route} route
     *
     * @returns {Jymfony.Component.Routing.CompiledRoute}
     */
    static compile(route) {
        let hostVariables = [];
        let variables = [];
        let hostRegex;
        let hostTokens = [];

        const host = route.host;
        if (undefined !== host) {
            const result = __self._compilePattern(route, host, true);

            hostVariables = result.variables;
            variables = hostVariables;
            hostTokens = result.tokens;
            hostRegex = result.regex;
        }

        const path = route.path;
        const result = __self._compilePattern(route, path, false);

        for (const variable of result.variables) {
            if ('_fragment' === variable) {
                throw new InvalidArgumentException(__jymfony.sprintf('Route pattern "%s" cannot contain "_fragment" as a path parameter.', route.path));
            }
        }

        variables = [ ...variables, ...result.variables ];

        return new CompiledRoute(
            result.staticPrefix,
            result.regex,
            result.tokens,
            result.variables,
            hostRegex,
            hostTokens,
            hostVariables,
            [ ...new Set(variables) ]
        );
    }

    /**
     * @param {Jymfony.Component.Routing.Route} route
     * @param {string} pattern
     * @param {boolean} isHost
     *
     * @private
     */
    static _compilePattern(route, pattern, isHost) {
        let pos = 0;
        const defaultSeparator = isHost ? '.' : '/';
        const variables = [];
        const tokens = [];

        let match;
        const re = /{!?\w+}/g;
        while ((match = re.exec(pattern))) {
            let varName = match[0].substr(1, match[0].length - 2);
            const precedingText = pattern.substr(pos, match.index - pos);
            pos = match.index + match[0].length;

            const precedingChar = 0 === precedingText.length ? '' : precedingText.substr(-1);
            const isSeparator = '' !== precedingChar && -1 !== SEPARATORS.indexOf(precedingChar);

            if (/^\d/.test(varName)) {
                throw new DomainException(__jymfony.sprintf('Variable name "%s" cannot start with a digit in route pattern "%s". Please use a different name.', varName, pattern));
            }

            if (-1 !== variables.indexOf(varName)) {
                throw new LogicException(__jymfony.sprintf('Route pattern "%s" cannot reference variable name "%s" more than once.', pattern, varName));
            }

            if (isSeparator && precedingText !== precedingChar) {
                tokens.push([ 'text', precedingText.substr(0, precedingText.length - precedingChar.length) ]);
            } else if (! isSeparator && 0 < precedingText.length) {
                tokens.push([ 'text', precedingText ]);
            }

            let regexp = route.getRequirement(varName);
            if (undefined === regexp) {
                const followingPattern = pattern.substr(pos);
                const nextSeparator = __self._findNextSeparator(followingPattern);

                regexp = __jymfony.sprintf(
                    '[^%s%s]+',
                    __jymfony.regex_quote(defaultSeparator),
                    defaultSeparator !== nextSeparator && '' !== nextSeparator ? __jymfony.regex_quote(nextSeparator) : ''
                );
            } else {
                regexp = __self._transformCapturingGroupsToNonCapturings(regexp.source);
            }

            tokens.push([ 'variable', isSeparator ? precedingChar : '', regexp, varName ]);
            if ('!' === varName[0]) {
                varName = varName.substr(1);
            }

            variables.push(varName);
        }

        if (pos < pattern.length) {
            tokens.push([ 'text', pattern.substr(pos) ]);
        }

        let firstOptional = Number.MAX_SAFE_INTEGER;
        if (! isHost) {
            for (let i = tokens.length - 1; 0 <= i; --i) {
                const token = tokens[i];
                if ('variable' === token[0] && route.hasDefault(token[3])) {
                    firstOptional = i;
                } else {
                    break;
                }
            }
        }

        let regexp = '';
        for (let i = 0, nbToken = tokens.length; i < nbToken; ++i) {
            regexp += __self._computeRegexp(tokens, i, firstOptional);
        }

        regexp = new RegExp('^' + regexp + '$', (isHost ? 'i' : ''));

        return {
            staticPrefix: __self._determineStaticPrefix(route, tokens),
            regex: regexp,
            tokens: tokens.reverse(),
            variables: variables,
        };
    }

    /**
     * @param {string} route
     * @param {string[]} tokens
     *
     * @returns {string}
     *
     * @private
     */
    static _determineStaticPrefix(route, tokens) {
        if ('text' !== tokens[0][0]) {
            return (route.hasDefault(tokens[0][3]) || '/' === tokens[0][1]) ? '' : tokens[0][1];
        }

        let prefix = tokens[0][1];
        if (undefined !== tokens[1] && undefined !== tokens[1][1] && '/' !== tokens[1][1] && false === route.hasDefault(tokens[1][3])) {
            prefix += tokens[1][1];
        }

        return prefix;
    }

    /**
     * @param {string} pattern
     *
     * @returns {string}
     *
     * @private
     */
    static _findNextSeparator(pattern) {
        if ('' === pattern) {
            // Return empty string if pattern is empty or false (false which can be returned by substr)
            return '';
        }

        // First remove all placeholders from the pattern so we can find the next real static character
        pattern = pattern.replace(/{\w+}/g, '');
        if ('' === pattern) {
            return '';
        }

        return -1 !== SEPARATORS.indexOf(pattern.charAt(0)) ? pattern.charAt(0) : '';
    }

    /**
     * @param {string[]} tokens
     * @param {int} index
     * @param {int} firstOptional
     *
     * @returns {string}
     *
     * @private
     */
    static _computeRegexp(tokens, index, firstOptional) {
        const token = tokens[index];
        if ('text' === token[0]) {
            return __jymfony.regex_quote(token[1]);
        }

        if ('variable' === token[0] && '!' === token[3][0]) {
            token[3] = token[3].substr(1);
        }

        if (0 === index && 0 === firstOptional) {
            return __jymfony.sprintf('%s(?<%s>%s)?', __jymfony.regex_quote(token[1]), token[3], token[2]);
        }

        let regexp = __jymfony.sprintf('%s(?<%s>%s)', __jymfony.regex_quote(token[1]), token[3], token[2]);
        if (index >= firstOptional) {
            regexp = '(?:' + regexp;
            const nbTokens = tokens.length;
            if (nbTokens - 1 === index) {
                regexp += ')?'.repeat(nbTokens - firstOptional - (0 === firstOptional ? 1 : 0));
            }
        }

        return regexp;
    }

    /**
     * Transforms capturing groups in requirements to non-capturing groups
     *
     * @param {string} regexp
     * @returns {string}
     *
     * @private
     */
    static _transformCapturingGroupsToNonCapturings(regexp) {
        for (let i = 0; i < regexp.length; ++i) {
            if ('\\' === regexp[i]) {
                ++i;
                continue;
            }

            if ('(' !== regexp[i] || ! regexp[i + 2]) {
                continue;
            }

            if ('*' === regexp[++i] || '?' === regexp[i]) {
                ++i;
                continue;
            }

            regexp = __jymfony.substr_replace(regexp, '?:', i, 0);
            ++i;
        }

        return regexp;
    }
}
