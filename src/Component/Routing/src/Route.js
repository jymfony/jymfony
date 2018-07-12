/**
 * A Route describes a route and its parameters.
 *
 * @memberOf Jymfony.Component.Routing
 */
class Route {
    /**
     * Constructor.
     *
     * @param {string} path
     * @param {Object.<string, *>} [defaults = {}]
     * @param {Object.<string, string>} [requirements = {}]
     * @param {Object.<string, *>} [options = {}]
     * @param {string[]} [host]
     * @param {string[]} [schemes = []]
     * @param {string[]} [methods = [ 'GET', 'POST' ]]
     * @param {string} [condition]
     */
    __construct(
        path,
        defaults = {},
        requirements = {},
        options = {},
        host = undefined,
        schemes = [],
        methods = [ 'GET', 'POST' ],
        condition = undefined
    ) {
        this
            .setPath(path)
            .setHost(host)
            .setSchemes(schemes)
            .setMethods(methods)
            .setOptions(options)
            .setDefaults(defaults)
            .setCondition(condition)
            .setRequirements(requirements)
        ;
    }

    /**
     * Gets the pattern for the path.
     *
     * @returns {string}
     */
    get path() {
        return this._path;
    }

    /**
     * Sets the pattern for the path.
     *
     * @param {string} path
     *
     * @returns {Jymfony.Component.Routing.Route}
     */
    setPath(path) {
        this._path = '/' + __jymfony.ltrim(__jymfony.trim(path), '/');
        this._compiled = undefined;

        return this;
    }

    /**
     * Gets the pattern for the host.
     *
     * @returns {string}
     */
    get host() {
        return this._host;
    }

    /**
     * Sets the pattern for the host.
     *
     * @param {string} host
     *
     * @returns {Jymfony.Component.Routing.Route}
     */
    setHost(host) {
        this._host = host;
        this._compiled = undefined;

        return this;
    }

    /**
     * Returns the lowercased schemes this route is restricted to.
     * So an empty array means that any scheme is allowed.
     *
     * @returns {string[]}
     */
    get schemes() {
        return this._schemes;
    }

    /**
     * Sets the schemes (e.g. 'https') this route is restricted to.
     * So an empty array means that any scheme is allowed.
     *
     * @param {string[]} schemes
     *
     * @returns {Jymfony.Component.Routing.Route}
     */
    setSchemes(schemes) {
        this._schemes = schemes.map(s => s.toLowerCase());
        this._compiled = undefined;

        return this;
    }

    /**
     * Checks if a scheme requirement has been set.
     *
     * @param {string} scheme
     *
     * @returns {boolean}
     */
    hasScheme(scheme) {
        return -1 !== this._schemes.indexOf(scheme.toLowerCase());
    }

    /**
     * Returns the uppercased HTTP methods this route is restricted to.
     *
     * @returns {string[]}
     */
    get methods() {
        return this._methods;
    }

    /**
     * Sets the methods (e.g. 'POST') this route is restricted to.
     * An empty array is not allowed.
     *
     * @param {string[]} methods
     *
     * @returns {Jymfony.Component.Routing.Route}
     */
    setMethods(methods) {
        if (0 === methods.length) {
            throw new InvalidArgumentException('At least one method must be set for a route');
        }

        this._methods = methods.map(s => s.toUpperCase());
        this._compiled = undefined;

        return this;
    }

    /**
     * Returns the options.
     *
     * @returns {Object.<string, *>}
     */
    get options() {
        return this._options;
    }

    /**
     * Sets the options.
     *
     * @param {Object.<string, *>} options
     *
     * @returns {Jymfony.Component.Routing.Route}
     */
    setOptions(options) {
        this._options = {
            compiler_class: 'Jymfony.Component.Routing.RouteCompiler',
        };

        return this.addOptions(options);
    }

    /**
     * Adds options.
     *
     * @param {Object.<string, *>} options
     *
     * @returns {Jymfony.Component.Routing.Route}
     */
    addOptions(options) {
        for (const [ name, option ] of __jymfony.getEntries(options)) {
            this._options[name] = option;
        }

        this._compiled = undefined;

        return this;
    }

    /**
     * Sets an option value.
     *
     * @param {string} name
     * @param {*} value
     *
     * @returns {Jymfony.Component.Routing.Route}
     */
    setOption(name, value) {
        this._options[name] = value;
        this._compiled = undefined;

        return this;
    }

    /**
     * Gets an option value.
     *
     * @param {string} name
     *
     * @returns {*}
     */
    getOption(name) {
        return this._options[name];
    }

    /**
     * Checks if an option has been set.
     *
     * @param {string} name
     *
     * @returns {boolean}
     */
    hasOption(name) {
        return this._options.hasOwnProperty(name);
    }

    /**
     * Returns the defaults.
     *
     * @returns {Object.<string, *>}
     */
    get defaults() {
        return this._defaults;
    }

    /**
     * Sets the defaults.
     *
     * @param {Object.<string, *>} defaults
     *
     * @returns {Jymfony.Component.Routing.Route}
     */
    setDefaults(defaults) {
        this._defaults = {};

        return this.addDefaults(defaults);
    }

    /**
     * Adds defaults.
     *
     * @param {Object.<string, *>} defaults
     *
     * @returns {Jymfony.Component.Routing.Route}
     */
    addDefaults(defaults) {
        for (const [ name, def ] of __jymfony.getEntries(defaults)) {
            this._defaults[name] = def;
        }

        this._compiled = undefined;

        return this;
    }

    /**
     * Sets a default value.
     *
     * @param {string} name
     * @param {*} value
     *
     * @returns {Jymfony.Component.Routing.Route}
     */
    setDefault(name, value) {
        this._defaults[name] = value;
        this._compiled = undefined;

        return this;
    }

    /**
     * Gets a default value.
     *
     * @param {string} name
     *
     * @returns {*}
     */
    getDefault(name) {
        return this._defaults[name];
    }

    /**
     * Checks if a default value has been set.
     *
     * @param {string} name
     *
     * @returns {boolean}
     */
    hasDefault(name) {
        return this._defaults.hasOwnProperty(name);
    }

    /**
     * Sets the route condition.
     */
    setCondition(/* condition */) {
        // @todo

        return this;
    }

    /**
     * Gets the requirements.
     *
     * @returns {Object.<string, RegExp>}
     */
    get requirements() {
        return this._requirements;
    }

    /**
     * Sets the requirements-
     *
     * @param {Object.<string, string|RegExp>|string[]|RegExp[]} requirements
     *
     * @returns {Jymfony.Component.Routing.Route}
     */
    setRequirements(requirements) {
        this._requirements = {};

        return this.addRequirements(requirements);
    }

    /**
     * Add requirements.
     *
     * @param {Object.<string, string|RegExp>|string[]|RegExp[]} requirements
     *
     * @returns {Jymfony.Component.Routing.Route}
     */
    addRequirements(requirements) {
        for (const [ key, regex ] of __jymfony.getEntries(requirements)) {
            this._requirements[key] = this._sanitizeRequirement(key, regex);
        }

        this._compiled = undefined;

        return this;
    }

    /**
     * Gets a requirement by key.
     *
     * @param {string} key
     *
     * @returns {RegExp|undefined}
     */
    getRequirement(key) {
        return this._requirements[key];
    }

    /**
     * Checks if a requirement for key has been set.
     *
     * @param {string} key
     *
     * @returns {boolean}
     */
    hasRequirement(key) {
        return this._requirements.hasOwnProperty(key);
    }

    /**
     * Sets a requirement.
     *
     * @param {string} key
     * @param {string|RegExp} regex
     *
     * @returns {Jymfony.Component.Routing.Route}
     */
    setRequirement(key, regex) {
        this._requirements[key] = this._sanitizeRequirement(key, regex);
        this._compiled = undefined;

        return this;
    }

    /**
     * Compiles the route.
     *
     * @returns {Jymfony.Component.Routing.CompiledRoute}
     */
    compile() {
        if (undefined !== this._compiled) {
            return this._compiled;
        }

        const class_ = ReflectionClass.getClass(this.getOption('compiler_class'));
        return this._compiled = class_['compile'](this);
    }

    /**
     * Sanitize a requirement.
     *
     * @param {string} key
     * @param {string|RegExp} regex
     *
     * @returns {RegExp}
     *
     * @private
     */
    _sanitizeRequirement(key, regex) {
        if (regex instanceof RegExp) {
            regex = regex.source;
        }

        if (! isString(regex)) {
            throw new InvalidArgumentException(__jymfony.sprintf('Routing requirement for "%s" must be a string or a RegExp object.', key));
        }

        if ('' !== regex && '^' === regex.charAt(0)) {
            regex = regex.substr(1);
        }

        if ('$' !== regex.substr(-1)) {
            regex = regex.substr(0, -1);
        }

        if ('' === regex) {
            throw new InvalidArgumentException(__jymfony.sprintf('Routing requirement for "%s" cannot be empty.', key));
        }

        return new RegExp(regex);
    }
}


module.exports = Route;
