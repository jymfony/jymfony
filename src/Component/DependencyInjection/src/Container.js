const ContainerInterface = Jymfony.Contracts.DependencyInjection.ContainerInterface;
const ServiceNotFoundException = Jymfony.Component.DependencyInjection.Exception.ServiceNotFoundException;
const ServiceCircularReferenceException = Jymfony.Component.DependencyInjection.Exception.ServiceCircularReferenceException;
const FrozenParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.FrozenParameterBag;
const ParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag;

const underscoreMap = {'_': '', '.': '_', '\\': '_'};

/**
 * @memberOf Jymfony.Component.DependencyInjection
 */
export default class Container extends implementationOf(ContainerInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag} [parameterBag]
     */
    __construct(parameterBag = undefined) {
        /**
         * @type {Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag}
         *
         * @protected
         */
        this._parameterBag = parameterBag || new ParameterBag();

        /**
         * @type {Object}
         *
         * @private
         */
        this._services = {};

        /**
         * @type {Object}
         *
         * @private
         */
        this._methodMap = {};

        /**
         * @type {Object}
         *
         * @private
         */
        this._privates = {};

        /**
         * @type {Object}
         *
         * @private
         */
        this._aliases = {};

        /**
         * @type {Object}
         *
         * @private
         */
        this._loading = {};

        /**
         * @type {Array}
         *
         * @private
         */
        this._shutdownCalls = [];
    }

    /**
     * Compiles the container.
     */
    compile() {
        this._parameterBag.resolve();

        this._parameterBag = new FrozenParameterBag(this._parameterBag.all());
    }

    /**
     * True if parameter bag is frozen.
     *
     * @returns {boolean}
     */
    get frozen() {
        return this._parameterBag instanceof FrozenParameterBag;
    }

    /**
     * Gets the container parameter bag.
     *
     * @returns {Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag}
     */
    get parameterBag() {
        return this._parameterBag;
    }

    /**
     * Gets a parameter.
     *
     * @param {string} name
     *
     * @returns {string}
     */
    getParameter(name) {
        return this.parameterBag.get(name);
    }

    /**
     * Checks if a parameter exists.
     *
     * @param {string} name
     *
     * @returns {boolean}
     */
    hasParameter(name) {
        return this.parameterBag.has(name);
    }

    /**
     * Sets a parameter.
     *
     * @param {string} name
     * @param {string} value
     */
    setParameter(name, value) {
        this.parameterBag.set(name, value);
    }

    /**
     * Sets a service.
     *
     * @param {string} id
     * @param {*} service
     */
    set(id, service) {
        id = __self.normalizeId(id);

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
     * Checks if a service is defined.
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
     * Gets a service.
     *
     * @param {string} id
     * @param {int} [invalidBehavior = Jymfony.Component.DependencyInjection.Container.EXCEPTION_ON_INVALID_REFERENCE]
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

        this._loading[id] = true;

        try {
            if (this._methodMap[id]) {
                return __self.IGNORE_ON_UNINITIALIZED_REFERENCE === invalidBehavior ? undefined : this[this._methodMap[id]]();
            }
        } catch (e) {
            delete this._services[id];

            throw e;
        } finally {
            delete this._loading[id];
        }

        if (Container.EXCEPTION_ON_INVALID_REFERENCE === invalidBehavior) {
            throw new ServiceNotFoundException(id);
        }

        return null;
    }

    /**
     * Checks if a given service has been initialized.
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
     * Executes all the shutdown functions.
     *
     * @returns {Promise<any[]>}
     */
    shutdown() {
        return Promise.all(this._shutdownCalls);
    }

    /**
     * Resets the container.
     */
    async reset() {
        await this.shutdown();
        this._services = {};
    }

    /**
     * Gets all service ids.
     *
     * @returns {string[]}
     */
    getServiceIds() {
        const set = new Set([ ...Object.keys(this._methodMap), ...Object.keys(this._services), 'service_container' ]);
        return Array.from(set);
    }

    /**
     * Register a function to call at shutdown.
     *
     * @param {AsyncFunction|Function} call
     */
    registerShutdownCall(call) {
        this._shutdownCalls.push(call);
    }

    /**
     * Normalizes a class definition (Function) to its class name.
     *
     * @param {string} id
     *
     * @returns {string}
     */
    static normalizeId(id) {
        const value = id;
        if (undefined === id || null === id) {
            throw new InvalidArgumentException('Invalid service id.');
        }

        if (isFunction(id)) {
            try {
                id = (new ReflectionClass(id)).name;
            } catch (e) { }
        }

        if (undefined === id || null === id) {
            return Symbol.for(value).description;
        }

        return id;
    }

    /**
     * Underscorizes a string.
     *
     * @param {string} id
     *
     * @returns {string}
     */
    static underscore(id) {
        return id
            .replace(/_/g, '.')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
            .toLowerCase()
        ;
    }

    /**
     * Camelizes a string.
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
Container.IGNORE_ON_UNINITIALIZED_REFERENCE = 4;
