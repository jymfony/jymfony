/**
 * @memberOf Jymfony.Component.Routing
 */
export default class RequestContext {
    /**
     * Constructor.
     *
     * @param {string} method
     * @param {string} host
     * @param {string} scheme
     * @param {int} httpPort
     * @param {int} httpsPort
     * @param {string} path
     * @param {string} queryString
     */
    __construct(method = 'GET', host = 'localhost', scheme = 'http', httpPort = 80, httpsPort = 443, path = '/', queryString = '') {
        /**
         * @type {string}
         */
        this.method = method;

        /**
         * @type {string}
         */
        this.host = host;

        /**
         * @type {string}
         */
        this.scheme = scheme;

        /**
         * @type {int}
         */
        this.httpPort = ~~httpPort;

        /**
         * @type {int}
         */
        this.httpsPort = ~~httpsPort;

        /**
         * @type {string}
         */
        this.path = path;

        /**
         * @type {string}
         */
        this.queryString = queryString;

        /**
         * @type {Object.<string, *>}
         *
         * @private
         */
        this._parameters = {};
    }


    /**
     * Returns the parameters.
     *
     * @returns {Object.<string, *>} The parameters
     */
    get parameters() {
        return this._parameters;
    }

    /**
     * Sets the parameters.
     *
     * @param {Object.<string, *>} parameters The parameters
     */
    set parameters(parameters) {
        this._parameters = parameters;
    }

    /**
     * Gets a parameter value.
     *
     * @param {string} name A parameter name
     *
     * @returns {*} The parameter value or undefined if nonexistent
     */
    getParameter(name) {
        return this._parameters[name];
    }

    /**
     * Checks if a parameter value is set for the given parameter.
     *
     * @param {string} name A parameter name
     *
     * @returns {boolean} True if the parameter value is set, false otherwise
     */
    hasParameter(name) {
        return !! this._parameters[name];
    }

    /**
     * Sets a parameter value.
     *
     * @param {string} name A parameter name
     * @param {*} parameter The parameter value
     *
     * @returns {Jymfony.Component.Routing.RequestContext}
     */
    setParameter(name, parameter) {
        this._parameters[name] = parameter;

        return this;
    }
}
