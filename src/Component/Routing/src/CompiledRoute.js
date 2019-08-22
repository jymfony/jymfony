/**
 * @memberOf Jymfony.Component.Routing
 */
export default class CompiledRoute {
    /**
     * Constructor.
     *
     * @param {string} staticPrefix
     * @param {RegExp} regex
     * @param {string[][]} tokens
     * @param {string[]} pathVariables
     * @param {RegExp} hostRegex
     * @param {string[][]} hostTokens
     * @param {string[]} hostVariables
     * @param {string[]} variables
     */
    __construct(staticPrefix, regex, tokens, pathVariables, hostRegex, hostTokens, hostVariables, variables) {
        /**
         * @type {string}
         *
         * @private
         */
        this._staticPrefix = staticPrefix;

        /**
         * @type {RegExp}
         *
         * @private
         */
        this._regex = regex;

        /**
         * @type {string[][]}
         *
         * @private
         */
        this._tokens = tokens;

        /**
         * @type {string[]}
         *
         * @private
         */
        this._pathVariables = pathVariables;

        /**
         * @type {RegExp}
         *
         * @private
         */
        this._hostRegex = hostRegex;

        /**
         * @type {string[][]}
         *
         * @private
         */
        this._hostTokens = hostTokens;

        /**
         * @type {string[]}
         *
         * @private
         */
        this._hostVariables = hostVariables;

        /**
         * @type {string[]}
         *
         * @private
         */
        this._variables = variables;
    }

    /**
     * @returns {string}
     */
    get staticPrefix() {
        return this._staticPrefix;
    }

    /**
     * Gets the compiled RegExp for path.
     *
     * @returns {RegExp}
     */
    get regex() {
        return this._regex;
    }

    /**
     * Gets the compiled RegExp for host.
     *
     * @returns {RegExp}
     */
    get hostRegex() {
        return this._hostRegex;
    }

    /**
     * @returns {string[][]}
     */
    get tokens() {
        return this._tokens;
    }

    /**
     * @returns {string[]}
     */
    get variables() {
        return this._variables;
    }

    /**
     * @returns {string[][]}
     */
    get hostTokens() {
        return this._hostTokens;
    }

    /**
     * @returns {string[]}
     */
    get pathVariables() {
        return this._pathVariables;
    }

    /**
     * @returns {string[]}
     */
    get hostVariables() {
        return this._hostVariables;
    }
}
