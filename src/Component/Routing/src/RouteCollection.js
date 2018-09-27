/**
 * A RouteCollection represents a set of Route instances.
 *
 * When adding a route at the end of the collection, an existing route
 * with the same name is removed first. So there can only be one route
 * with a given name.
 *
 * @memberOf Jymfony.Component.Routing
 */
class RouteCollection {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * @type {Object.<string, Jymfony.Component.Routing.Route>}
         *
         * @private
         */
        this._routes = {};

        /**
         * @type {Object.<string, Jymfony.Component.Config.ResourceInterface>}
         *
         * @private
         */
        this._resources = {};
    }

    /**
     * Adds a route.
     *
     * @param {string} name
     * @param {Jymfony.Component.Routing.Route} route
     *
     * @returns {Jymfony.Component.Routing.RouteCollection}
     */
    add(name, route) {
        delete this._routes[name];
        this._routes[name] = route;

        return this;
    }

    /**
     * Returns all routes in this collection.
     *
     * @returns {Object.<string, Jymfony.Component.Routing.Route>}
     */
    all() {
        return Object.assign({}, this._routes);
    }

    /**
     * Gets a route by name.
     *
     * @param {string} name
     *
     * @returns {Jymfony.Component.Routing.Route|undefined}
     */
    get(name) {
        return this._routes[name];
    }

    /**
     * Removes a route or an array of routes from the collection
     *
     * @param {string|string[]} name
     *
     * @returns {Jymfony.Component.Routing.RouteCollection}
     */
    remove(name) {
        if (! isArray(name)) {
            name = [ name ];
        }

        for (const n of name) {
            delete this._routes[n];
        }

        return this;
    }

    /**
     * Adds a route collection at the end of the current set by appending all
     * routes of the added collection.
     *
     * @param {Jymfony.Component.Routing.RouteCollection} collection
     *
     * @returns {Jymfony.Component.Routing.RouteCollection}
     */
    addCollection(collection) {
        for (const [ name, route ] of __jymfony.getEntries(collection.all())) {
            delete this._routes[name];
            this._routes[name] = route;
        }

        for (const resource of collection.resources) {
            this.addResource(resource);
        }

        return this;
    }

    /**
     * Adds a prefix to the path of all child routes.
     *
     * @param {string} prefix An optional prefix to add before each pattern of the route collection
     * @param {Object.<string, *>} [defaults = {}] A set of default values
     * @param {Object.<string, string|RegExp>} [requirements = {}]  A set of requirements
     *
     * @returns {Jymfony.Component.Routing.RouteCollection}
     */
    addPrefix(prefix, defaults = {}, requirements = {}) {
        prefix = __jymfony.trim(__jymfony.trim(prefix), '/');

        if ('' === prefix) {
            return this;
        }

        for (const route of this._routes) {
            route.setPath('/' + prefix + route.path);
            route.addDefaults(defaults);
            route.addRequirements(requirements);
        }

        return this;
    }

    /**
     * Sets the host pattern on all routes.
     *
     * @param {string} pattern The pattern
     * @param {Object.<string, *>} [defaults = {}] A set of default values
     * @param {Object.<string, string|RegExp>} [requirements = {}] A set of requirements
     *
     * @returns {Jymfony.Component.Routing.RouteCollection}
     */
    addHost(pattern, defaults = {}, requirements = {}) {
        for (const route of this._routes) {
            route.setHost(pattern);
            route.addDefaults(defaults);
            route.addRequirements(requirements);
        }

        return this;
    }

    /**
     * Adds a resource for this collection.
     *
     * @param {Jymfony.Component.Config.ResourceInterface} resource
     */
    addResource(resource) {
        const key = resource.toString();

        if (undefined !== this._resources[key]) {
            this._resources[key] = resource;
        }
    }

    /**
     * Sets a condition on all routes.
     * Existing conditions will be overridden.
     *
     * @param {string} condition The condition
     */
    setCondition(/* condition */) {
        // @todo
    }

    /**
     * Adds defaults to all routes.
     * An existing default value under the same name in a route will be overridden.
     *
     * @param {Object.<string, *>} defaults A set of default values
     */
    addDefaults(defaults) {
        if (0 === Object.keys(defaults).length) {
            return this;
        }

        for (const route of this._routes) {
            route.addDefaults(defaults);
        }

        return this;
    }

    /**
     * Adds requirements to all routes.
     * An existing requirement under the same name in a route will be overridden.
     *
     * @param {Object.<string, string|RegExp>} requirements A set of requirements
     */
    addRequirements(requirements) {
        if (0 === Object.keys(requirements).length) {
            return this;
        }

        for (const route of this._routes) {
            route.addRequirements(requirements);
        }

        return this;
    }

    /**
     * Adds options to all routes.
     * An existing option value under the same name in a route will be overridden.
     *
     * @param {Object.<string, *>} options An array of options
     */
    addOptions(options) {
        if (0 === Object.keys(options).length) {
            return this;
        }

        for (const route of this._routes) {
            route.addOptions(options);
        }

        return this;
    }

    /**
     * Sets the schemes (e.g. 'https') all child routes are restricted to.
     *
     * @param {string|string[]} schemes The scheme or an array of schemes
     */
    setSchemes(schemes) {
        for (const route of this._routes) {
            route.setSchemes(schemes);
        }
    }

    /**
     * Sets the HTTP methods (e.g. 'POST') all child routes are restricted to.
     *
     * @param {string|string[]} methods The method or an array of methods
     */
    setMethods(methods) {
        for (const route of this._routes) {
            route.setMethods(methods);
        }
    }

    /**
     * Returns the set of resources loaded to build this collection.
     *
     * @returns {Jymfony.Component.Config.ResourceInterface[]}
     */
    get resources() {
        return Object.values(this._resources);
    }

    /**
     * Gets the number of routes in this collection.
     *
     * @returns {int}
     */
    get length() {
        return Object.keys(this._routes).length;
    }

    /**
     * Gets the iterator for this collection
     *
     * @returns {Generator}
     */
    [Symbol.iterator]() {
        return __jymfony.getEntries(this._routes);
    }
}

module.exports = RouteCollection;
