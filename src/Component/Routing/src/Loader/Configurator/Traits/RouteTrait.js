/**
 * @memberOf Jymfony.Component.Routing.Loader.Configurator.Traits
 */
class RouteTrait {
    __construct() {
        /**
         * @type {Jymfony.Component.Routing.Route|Jymfony.Component.Routing.RouteCollection}
         *
         * @private
         */
        this._route = this._route || undefined;
    }

    /**
     * Adds defaults.
     *
     * @param {Object} defaults
     *
     * @returns {this}
     */
    defaults(defaults) {
        this._route.addDefaults(defaults);

        return this;
    }

    /**
     * Adds requirements.
     *
     * @param {Object.<string, string|RegExp>|string[]|RegExp[]} requirements
     *
     * @returns {this}
     */
    requirements(requirements) {
        this._route.addRequirements(requirements);

        return this;
    }

    /**
     * Adds options.
     *
     * @param {Object.<string, *>} options
     *
     * @returns {this}
     */
    options(options) {
        this._route.addOptions(options);

        return this;
    }

    /**
     * Sets the condition.
     *
     * @param {string} condition
     *
     * @returns {this}
     */
    condition(condition) {
        this._route.setCondition(condition);

        return this;
    }

    /**
     * Sets the pattern for the host.
     *
     * @param {string} pattern
     *
     * @returns {this}
     */
    host(pattern) {
        this._route.setHost(pattern);

        return this;
    }

    /**
     * Sets the schemes (e.g. 'https') this route is restricted to.
     * So an empty array means that any scheme is allowed.
     *
     * @param {string[]} schemes
     *
     * @returns {this}
     */
    schemes(schemes) {
        this._route.setSchemes(schemes);

        return this;
    }

    /**
     * Sets the HTTP methods (e.g. 'POST') this route is restricted to.
     * So an empty array means that any method is allowed.
     *
     * @param {string[]} methods
     *
     * @returns {this}
     */
    methods(methods) {
        this._route.setMethods(methods);

        return this;
    }

    /**
     * Adds the "_controller" entry to defaults.
     *
     * @param {Function|string} controller a callable or parseable pseudo-callable
     *
     * @returns {this}
     */
    controller(controller) {
        this._route.addDefaults({'_controller': controller});

        return this;
    }
}

export default getTrait(RouteTrait);
