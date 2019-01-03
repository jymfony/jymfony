/**
 * @memberOf Jymfony.Component.DependencyInjection
 */
class Definition {
    /**
     * Constructor.
     *
     * @param {string} [class_]
     * @param {Array} [args = []]
     */
    __construct(class_ = undefined, args = []) {
        /**
         * @type {string|undefined}
         *
         * @private
         */
        this._class = undefined;

        /**
         * @type {Array}
         *
         * @private
         */
        this._arguments = args;

        /**
         * @type {string[]|undefined}
         *
         * @private
         */
        this._module = undefined;

        /**
         * @type {string|Array|undefined}
         *
         * @private
         */
        this._factory = undefined;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._shared = true;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._deprecated = false;

        /**
         * @type {string}
         *
         * @private
         */
        this._deprecationTemplate = 'The "%service_id%" service is deprecated. You should stop using it';

        /**
         * @type {Object}
         *
         * @private
         */
        this._properties = {};

        /**
         * @type {Array}
         *
         * @private
         */
        this._calls = [];

        /**
         * @type {string|Array|Function|undefined}
         *
         * @private
         */
        this._configurator = undefined;

        /**
         * @type {Object.<string, string>}
         *
         * @private
         */
        this._tags = {};

        /**
         * @type {boolean}
         *
         * @private
         */
        this._public = false;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._synthetic = false;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._abstract = false;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._lazy = false;

        /**
         * @type {*}
         *
         * @private
         */
        this._decoratedService = undefined;

        /**
         * @type {Array}
         *
         * @private
         */
        this._shutdown = [];

        /**
         * @type {Object}
         *
         * @private
         */
        this._changes = {};

        if (undefined !== class_) {
            this.setClass(class_);
        }
    }

    /**
     * Sets the changes.
     *
     * @param {Object} changes
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setChanges(changes) {
        this._changes = Object.assign({}, changes);

        return this;
    }

    /**
     * Returns all changes tracked for the Definition object.
     *
     * @returns {Object}
     */
    getChanges() {
        return Object.assign({}, this._changes);
    }

    /**
     * Sets the service factory.
     *
     * @param {string|Array} factory
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setFactory(factory) {
        this._changes['factory'] = true;

        if (isString(factory) && -1 !== factory.indexOf('#')) {
            factory = factory.split('#', 2);
        }

        this._factory = factory;
        return this;
    }

    /**
     * Gets the current factory.
     *
     * @returns {string|Array|undefined}
     */
    getFactory() {
        return this._factory;
    }

    /**
     * Sets the service that this service is decorating.
     *
     * @param {string} id
     * @param {string} [renamedId]
     * @param {int} [priority = 0]
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setDecoratedService(id, renamedId = undefined, priority = 0) {
        if (renamedId && id === renamedId) {
            throw new InvalidArgumentException('The decorated service inner name for "' + id + '" must be different than the service name');
        }

        this._changes['decorated_service'] = true;

        if (! id) {
            this._decoratedService = undefined;
        } else {
            this._decoratedService = [ id, renamedId, priority ];
        }

        return this;
    }

    /**
     * Gets the decorated service definition (id, inner id, priority).
     *
     * @returns {Array}
     */
    getDecoratedService() {
        if (! this._decoratedService) {
            return this._decoratedService;
        }

        return [ ...this._decoratedService ];
    }

    /**
     * Sets the service class.
     *
     * @param {string|Function} className
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setClass(className) {
        if (isFunction(className)) {
            try {
                className = (new ReflectionClass(className)).name;
            } catch (e) { }
        }

        this._changes['class'] = true;
        this._class = className;

        return this;
    }

    /**
     * Gets service class name.
     *
     * @returns {string}
     */
    getClass() {
        return this._class;
    }

    /**
     * Sets the arguments to pass to the service constructor/factory.
     *
     * @param {Array} args
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setArguments(args) {
        this._arguments = args;

        return this;
    }

    /**
     * Adds an argument to the list.
     *
     * @param {*} argument
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    addArgument(argument) {
        this._arguments.push(argument);

        return this;
    }

    /**
     * Replaces an argument.
     *
     * @param {int} index
     * @param {*} argument
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    replaceArgument(index, argument) {
        if (0 > index || index >= this._arguments.length) {
            throw new InvalidArgumentException('Index is not in the range [0, ' + (this._arguments.length - 1).toString() + ']');
        }

        this._arguments[index] = argument;

        return this;
    }

    /**
     * Gets the argument list.
     *
     * @returns {Array}
     */
    getArguments() {
        return __jymfony.deepClone(this._arguments);
    }

    /**
     * Gets a single argument.
     *
     * @param {int} index
     *
     * @returns {*}
     */
    getArgument(index) {
        if (0 > index || index >= this._arguments.length) {
            throw new InvalidArgumentException('Index is not in the range [0, ' + (this._arguments.length - 1).toString() + ']');
        }

        return this._arguments[index];
    }

    /**
     * Defines properties to set at service creation.
     *
     * @param {Object} properties
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setProperties(properties) {
        this._properties = properties;

        return this;
    }

    /**
     * Sets a property to set to the service.
     *
     * @param {string} property
     * @param {*} value
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    addProperty(property, value) {
        this._properties[property] = value;

        return this;
    }

    /**
     * Gets the properties to set on the service.
     *
     * @returns {Object}
     */
    getProperties() {
        return __jymfony.deepClone(this._properties);
    }

    /**
     * Sets the methods to call after service construction.
     *
     * @param {Array} [calls = []]
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setMethodCalls(calls = []) {
        this._calls = [];
        for (const call of calls) {
            this.addMethodCall(call[0], (call[1] || []));
        }

        return this;
    }

    /**
     * Adds a method to call.
     *
     * @param {string} method
     * @param {Array} [args = []]
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    addMethodCall(method, args = []) {
        if (! method) {
            throw new InvalidArgumentException('Method name cannot be empty');
        }

        this._calls.push([ method, args ]);

        return this;
    }

    /**
     * Removes a method to call after service initialization.
     *
     * @param {string} method
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    removeMethodCall(method) {
        for (let i = 0; i < this._calls.length; i++) {
            const call = this._calls[i];
            if (call[0] === method) {
                this._calls.splice(i, 1);
                break;
            }
        }

        return this;
    }

    /**
     * Checks if the definition has a given method call.
     *
     * @param {string} method
     *
     * @returns {boolean}
     */
    hasMethodCall(method) {
        for (const call of this._calls) {
            if (call[0] === method) {
                return true;
            }
        }

        return false;
    }

    /**
     * Gets the methods to call.
     *
     * @returns {Array}
     */
    getMethodCalls() {
        return __jymfony.deepClone(this._calls);
    }

    /**
     * Sets the service tags.
     *
     * @param {Object} tags
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setTags(tags) {
        this._tags = tags;

        return this;
    }

    /**
     * Gets all tags.
     *
     * @returns {Object}
     */
    getTags() {
        return __jymfony.deepClone(this._tags);
    }

    /**
     * Gets a tag by name.
     *
     * @param {string} name
     *
     * @returns {Object[]}
     */
    getTag(name) {
        if (! this._tags[name]) {
            return [];
        }

        return __jymfony.deepClone(this._tags[name]);
    }

    /**
     * Adds a tag.
     *
     * @param {string} name
     * @param {Object} attributes
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    addTag(name, attributes = {}) {
        this._tags[name] = this._tags[name] || [];
        this._tags[name].push(attributes);

        return this;
    }

    /**
     * Checks if a tag is present.
     *
     * @param {string} name
     *
     * @returns {boolean}
     */
    hasTag(name) {
        return !! this._tags[name];
    }

    /**
     * Clears all the tags for a given name.
     *
     * @param {string} name
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    clearTag(name) {
        delete this._tags[name];

        return this;
    }

    /**
     * Clears all the tags.
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    clearTags() {
        this._tags = {};

        return this;
    }

    /**
     * Use a module require as a factory for this service (with optional property).
     * The "new" operator is used only if a property is defined, otherwise
     * the result of the require call is used as service.
     *
     * @param {string} module The module to be required.
     * @param {string} [property] The property to be used as service in module.
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setModule(module, property = undefined) {
        this._changes['module'] = true;
        this._module = [ module, property ];

        return this;
    }

    /**
     * Gets the module to be used as service.
     *
     * @returns {string[]}
     */
    getModule() {
        return this._module;
    }

    /**
     * Sets if this service must be shared.
     *
     * @param {boolean} shared
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setShared(shared) {
        this._changes['shared'] = true;
        this._shared = !! shared;

        return this;
    }

    /**
     * Checks if this service is shared.
     *
     * @returns {boolean}
     */
    isShared() {
        return this._shared;
    }

    /**
     * Sets if this service is public (can be retrieved by Container#get).
     *
     * @param {boolean} _public
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setPublic(_public) {
        this._changes['public'] = true;
        this._public = !! _public;

        return this;
    }

    /**
     * Checks if this service should be public.
     *
     * @returns {boolean}
     */
    isPublic() {
        return this._public;
    }

    /**
     * Sets the lazy flag for this service.
     *
     * @param {boolean} lazy
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setLazy(lazy) {
        this._changes['lazy'] = true;
        this._lazy = !! lazy;

        return this;
    }

    /**
     * Is this service lazy?
     *
     * @returns {boolean}
     */
    isLazy() {
        return this._lazy;
    }

    /**
     * Sets if this is a synthetic service (cannot be constructed,
     * but must be injected).
     *
     * @param {boolean} synthetic
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setSynthetic(synthetic) {
        this._synthetic = !! synthetic;

        return this;
    }

    /**
     * Checks if this service is synthetic.
     *
     * @returns {boolean}
     */
    isSynthetic() {
        return this._synthetic;
    }

    /**
     * Sets the abstract flag for this service
     * Abstract services serves as templates for other ones.
     *
     * @param {boolean} abstract
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setAbstract(abstract) {
        this._abstract = !! abstract;

        return this;
    }

    /**
     * Checks if this is an abstract service.
     *
     * @returns {boolean}
     */
    isAbstract() {
        return this._abstract;
    }

    /**
     * Set the deprecated flag and message for this service
     * If marked as deprecated, a deprecation warning will be triggered
     * during its initialization. The deprecation message is defined by
     * the template parameter and could contain '%service_id%' that will
     * be replaced by the real service id.
     *
     * @param {boolean} [status = true]
     * @param {string} [template]
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setDeprecated(status = true, template = undefined) {
        if (template) {
            if (/[\r\n]|\*\//.test(template)) {
                throw new InvalidArgumentException('Invalid characters found in deprecation notice template');
            }

            this._deprecationTemplate = template;
        }

        this._changes['deprecated'] = true;
        this._deprecated = !! status;

        return this;
    }

    /**
     * Checks whether this service is deprecated.
     *
     * @returns {boolean}
     */
    isDeprecated() {
        return this._deprecated;
    }

    /**
     * Build the deprecation message for a given service id.
     *
     * @param {string} id
     *
     * @returns {string}
     */
    getDeprecationMessage(id) {
        return this._deprecationTemplate.replace(/%service_id%/g, id);
    }

    /**
     * Sets a configurator to be called after the service is initialized.
     *
     * @param {string|Array|Function} configurator
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setConfigurator(configurator) {
        this._changes['configurator'] = true;
        if (isString(configurator) && -1 !== configurator.indexOf('#')) {
            configurator = configurator.split('#', 2);
        }

        this._configurator = configurator;

        return this;
    }

    /**
     * Gets the configurator for this service.
     *
     * @returns {string|Array|Function|undefined}
     */
    getConfigurator() {
        return this._configurator;
    }

    /**
     * Sets the methods to call at container shutdown.
     *
     * @param {Array} [calls = []]
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setShutdownCalls(calls = []) {
        this._shutdown = [];
        for (const call of calls) {
            this.addShutdownCall(call[0], (call[1] || []));
        }

        return this;
    }

    /**
     * Adds a method to call at shutdown.
     *
     * @param {string} method
     * @param {Array} [args = []]
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    addShutdownCall(method, args = []) {
        if (! method) {
            throw new InvalidArgumentException('Method name cannot be empty');
        }

        this._shutdown.push([ method, args ]);

        return this;
    }

    /**
     * Removes a method to call at container shutdown.
     *
     * @param {string} method
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    removeShutdownCall(method) {
        for (let i = 0; i < this._shutdown.length; i++) {
            const call = this._shutdown[i];
            if (call[0] === method) {
                this._shutdown.splice(i, 1);
                break;
            }
        }

        return this;
    }

    /**
     * Checks if the definition has a given shutdown method call.
     *
     * @param {string} method
     *
     * @returns {boolean}
     */
    hasShutdownCall(method) {
        for (const call of this._shutdown) {
            if (call[0] === method) {
                return true;
            }
        }

        return false;
    }

    /**
     * Gets the methods to call at shutdown.
     *
     * @returns {Array}
     */
    getShutdownCalls() {
        return __jymfony.deepClone(this._shutdown);
    }
}

module.exports = Definition;
