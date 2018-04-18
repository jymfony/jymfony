const ServiceNotFoundException = Jymfony.Component.DependencyInjection.Exception.ServiceNotFoundException;
const ServiceCircularReferenceException = Jymfony.Component.DependencyInjection.Exception.ServiceCircularReferenceException;
const FrozenParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.FrozenParameterBag;
const ParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag;

const underscoreMap = {'_': '', '.': '_', '\\': '_'};

/**
 * @memberOf Jymfony.Component.DependencyInjection
 */
class Container {
    /**
     * Constructor.
     *
     * @param parameterBag
     */
    __construct(parameterBag) {
        this._parameterBag = parameterBag || new ParameterBag();

        this._services = {};
        this._methodMap = {};
        this._privates = {};
        this._aliases = {};
        this._loading = {};
    }

    /**
     * Compiles the container
     */
    compile() {
        this._parameterBag.resolve();

        this._parameterBag = new FrozenParameterBag(this._parameterBag.all());
    }

    /**
     * True if parameter bag is frozen
     *
     * @returns {boolean}
     */
    get frozen() {
        return this._parameterBag instanceof FrozenParameterBag;
    }

    /**
     * Get the container parameter bag
     *
     * @returns {Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag}
     */
    get parameterBag() {
        return this._parameterBag;
    }

    /**
     * Get a parameter
     *
     * @param name
     *
     * @returns {string}
     */
    getParameter(name) {
        return this.parameterBag.get(name);
    }

    /**
     * Check if a parameter exists
     *
     * @param name
     *
     * @returns {boolean}
     */
    hasParameter(name) {
        return this.parameterBag.has(name);
    }

    /**
     * Sets a parameter
     *
     * @param {string} name
     * @param {string} value
     */
    setParameter(name, value) {
        this.parameterBag.set(name, value);
    }

    /**
     * Sets a service
     *
     * @param {string} id
     * @param {*} service
     */
    set(id, service) {
        if ('service_container' === id) {
            throw new InvalidArgumentException('A service with name "service_container" cannot be set');
        }

        if (this._privates[id]) {
            throw new InvalidArgumentException('Unsetting/setting a private service is not allowed');
        }

        delete this._aliases[id];
        this._services[id] = service;

        if (undefined === service || null === service) {
            delete this._services[id];
        }
    }

    /**
     * Checks if a service is defined
     *
     * @param {string} id
     *
     * @returns {boolean}
     */
    has(id) {
        id = __self.normalizeId(id);

        if ('service_container' === id || undefined !== this._aliases[id] || undefined !== this._services[id]) {
            return true;
        }

        if (undefined !== this._methodMap[id]) {
            return true;
        }

        if (this.constructor instanceof Jymfony.Component.DependencyInjection.ContainerBuilder) {
            return this['get' + __jymfony.strtr(id, underscoreMap) + 'Service'] !== undefined;
        }

        return false;
    }

    /**
     * Gets a service
     *
     * @param {string} id
     * @param invalidBehavior
     *
     * @returns {*}
     */
    get(id, invalidBehavior = Container.EXCEPTION_ON_INVALID_REFERENCE) {
        id = __self.normalizeId(id);

        if ('service_container' === id) {
            return this;
        }

        if (this._aliases[id]) {
            id = this._aliases[id];
        }

        if (this._services.hasOwnProperty(id)) {
            return this._services[id];
        }

        if (this._loading[id]) {
            throw new ServiceCircularReferenceException(id, Object.keys(this._loading));
        }

        let method;
        if (this._methodMap[id]) {
            method = this._methodMap[id];
        } else {
            if (Container.EXCEPTION_ON_INVALID_REFERENCE === invalidBehavior) {
                throw new ServiceNotFoundException(id);
            }

            return;
        }

        this._loading[id] = true;

        let service;
        try {
            service = this[method]();
        } catch (e) {
            delete this._services[id];

            throw e;
        } finally {
            delete this._loading[id];
        }

        return service;
    }

    /**
     * Checks if a given service has been initialized
     *
     * @param {string} id
     *
     * @returns {boolean}
     */
    initialized(id) {
        id = __self.normalizeId(id);

        if ('service_container' === id) {
            return false;
        }

        if (this._aliases[id]) {
            id = this._aliases[id];
        }

        return undefined !== this._services[id];
    }

    /**
     * Resets the container
     */
    reset() {
        this._services = {};
    }

    /**
     * Get all service ids
     *
     * @returns {string[]}
     */
    getServiceIds() {
        const set = new Set([ ...Object.keys(this._methodMap), ...Object.keys(this._services), 'service_container' ]);
        return Array.from(set);
    }

    /**
     * Normalizes a class definition (Function) to its class name.
     *
     * @param id
     *
     * @returns {*}
     */
    static normalizeId(id) {
        if (isFunction(id)) {
            try {
                return (new ReflectionClass(id)).name;
            } catch (e) { }
        }

        return id;
    }

    /**
     * Underscorize a string
     *
     * @param {string} id
     *
     * @returns {string}
     */
    static underscore(id) {
        return id.toLowerCase()
            .replace(/_/g, '.')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
        ;
    }

    /**
     * Camelizes a string
     *
     * @param {string} id
     *
     * @returns {string}
     */
    static camelize(id) {
        return __jymfony.strtr(__jymfony.ucwords(__jymfony.strtr(id, {'_': ' ', '.': '_ ', '\\': '_ '})), {' ': ''});
    }
}

Container.EXCEPTION_ON_INVALID_REFERENCE = 1;
Container.NULL_ON_INVALID_REFERENCE = 2;
Container.IGNORE_ON_INVALID_REFERENCE = 3;

module.exports = Container;
