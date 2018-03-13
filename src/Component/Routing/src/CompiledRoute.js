/**
 * @memberOf Jymfony.Component.Routing
 */
class CompiledRoute {
    __construct(staticPrefix, regex, tokens, pathVariables, hostRegex, hostTokens, hostVariables, variables) {
        this._staticPrefix = staticPrefix;
        this._regex = regex;
        this._tokens = tokens;
        this._pathVariables = pathVariables;
        this._hostRegex = hostTokens;
        this._hostTokens = hostTokens;
        this._hostVariables = hostVariables;
        this._variables = variables;
    }

    get staticPrefix() {
        return this._staticPrefix;
    }

    /**
     * Gets the compiled RegExp for path.
     *
     * @return {RegExp}
     */
    get regex() {
        return this._regex;
    }

    /**
     * Gets the compiled RegExp for host.
     *
     * @return {RegExp}
     */
    get hostRegex() {
        return this._hostRegex;
    }

    get tokens() {
        return this._tokens;
    }

    get variables() {
        return this._variables;
    }

    get pathVariables() {
        return this._pathVariables;
    }

    get hostVariables() {
        return this._hostVariables;
    }
}

module.exports = CompiledRoute;
