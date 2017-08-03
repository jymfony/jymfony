/**
 * @memberOf Jymfony.Component.DependencyInjection
 * @type {Jymfony.Component.DependencyInjection.Definition}
 */
module.exports = class Definition {
    constructor(class_ = undefined, args = []) {
        this._class = class_;
        this._arguments = args;

        this._file = undefined;
        this._factory = undefined;
        this._shared = true;
        this._deprecated = false;
        this._deprecationTemplate = 'The "%service_id%" service is deprecated. You should stop using it';
        this._properties = {};
        this._calls = [];
        this._configurator = undefined;
        this._tags = {};
        this._public = false;
        this._synthetic = false;
        this._abstract = false;
        this._lazy = false;
        this._decoratedService = undefined;
    }

    /**
     * Set the service factory
     *
     * @param {string|Array} factory
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setFactory(factory) {
        if (isString(factory) && -1 !== factory.indexOf('#')) {
            factory = factory.split('#', 2);
        }

        this._factory = factory;
        return this;
    }

    /**
     * Get the current factory
     *
     * @returns {string|Array|undefined}
     */
    getFactory() {
        return this._factory;
    }

    /**
     * Set the service that this service is decorating
     *
     * @param {string} id
     * @param {string} renamedId
     * @param {int} priority
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setDecoratedService(id, renamedId = undefined, priority = 0) {
        if (renamedId && id === renamedId) {
            throw new InvalidArgumentException('The decorated service inner name for "' + id + '" must be different than the service name');
        }

        if (! id) {
            this._decoratedService = undefined;
        } else {
            this._decoratedService = [ id, renamedId, priority ];
        }

        return this;
    }

    /**
     * Get the decorated service definition (id, inner id, priority)
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
     * Set the service class
     *
     * @param {string} className
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setClass(className) {
        this._class = className;

        return this;
    }

    /**
     * Get service class name
     *
     * @returns {string}
     */
    getClass() {
        return this._class;
    }

    /**
     * Sets the arguments to pass to the service constructor/factory
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
     * Adds an argument to the list
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
     * Replaces an argument
     *
     * @param {int} index
     * @param {*} argument
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    replaceArgument(index, argument) {
        if (0 > index || index >= this._arguments.length) {
            throw new InvalidArgumentException('Index is not in the range [0, ' + this._arguments.length.toString() + ']');
        }

        this._arguments[index] = argument;

        return this;
    }

    /**
     * Gets the argument list
     *
     * @returns {Array}
     */
    getArguments() {
        return __jymfony.deepClone(this._arguments);
    }

    /**
     * Gets a single argument
     *
     * @param {int} index
     *
     * @returns {*}
     */
    getArgument(index) {
        if (0 > index || index >= this._arguments.length) {
            throw new InvalidArgumentException('Index is not in the range [0, ' + this._arguments.length.toString() + ']');
        }

        return this._arguments[index];
    }

    /**
     * Define properties to set at service creation
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
     * Set a property to set to the service
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
     * Get the properties to set on the service
     *
     * @returns {Object}
     */
    getProperties() {
        return __jymfony.deepClone(this._properties);
    }

    /**
     * Set the methods to call after service construction
     *
     * @param {Array} calls
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setMethodCalls(calls = []) {
        this._calls = [];
        for (let call of calls) {
            this.addMethodCall(call[0], (call[1] || []));
        }

        return this;
    }

    /**
     * Add a method to call
     *
     * @param {string} method
     * @param {Array} args
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
     * Removes a method to call after service initialization
     *
     * @param {string} method
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    removeMethodCall(method) {
        for (let i = 0; i < this._calls.length; i++) {
            let call = this._calls[i];
            if (call[0] === method) {
                this._calls.splice(i, 1);
                break;
            }
        }

        return this;
    }

    /**
     * Checks if the definition has a given method call
     *
     * @param {string} method
     *
     * @returns {boolean}
     */
    hasMethodCall(method) {
        for (let call of this._calls) {
            if (call[0] === method) {
                return true;
            }
        }

        return false;
    }

    /**
     * Gets the methods to call
     *
     * @returns {Array}
     */
    getMethodCalls() {
        return __jymfony.deepClone(this._calls);
    }

    /**
     * Sets the service tags
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
     * Gets all tags
     *
     * @returns {Object}
     */
    getTags() {
        return __jymfony.deepClone(this._tags);
    }

    /**
     * Get a tag by name
     *
     * @param {string} name
     *
     * @returns {Object}
     */
    getTag(name) {
        if (! this._tags[name]) {
            return {};
        }

        return __jymfony.deepClone(this._tags[name]);
    }

    /**
     * Add a tag
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
     * Checks if a tag is present
     *
     * @param {string} name
     *
     * @returns {boolean}
     */
    hasTag(name) {
        return !! this._tags[name];
    }

    /**
     * Clears all the tags for a given name
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
     * Clears all the tags
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    clearTags() {
        this._tags = {};

        return this;
    }

    /**
     * Sets a file to be required before creating the service
     *
     * @param {string} file
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setFile(file) {
        this._file = file;

        return this;
    }

    /**
     * Gets the file to be required before creating the service
     *
     * @returns {string}
     */
    getFile() {
        return this._file;
    }

    /**
     * Sets if this service must be shared
     *
     * @param {boolean} shared
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setShared(shared) {
        this._shared = !! shared;

        return this;
    }

    /**
     * Checks if this service is shared
     *
     * @returns {boolean}
     */
    isShared() {
        return this._shared;
    }

    /**
     * Sets if this service is public (can be retrieved by Container#get)
     *
     * @param {boolean} _public
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setPublic(_public) {
        this._public = !! _public;

        return this;
    }

    /**
     * Checks if this service should be public
     *
     * @returns {boolean}
     */
    isPublic() {
        return this._public;
    }

    /**
     * Sets the lazy flag for this service
     *
     * @param {boolean} lazy
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setLazy(lazy) {
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
     * but must be injected)
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
     * Checks if this service is synthetic
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
     * Checks if this is an abstract service
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
     * be replaced by the real service id
     *
     * @param {boolean} status
     * @param {string} template
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

        this._deprecated = !! status;

        return this;
    }

    /**
     * Checks whether this service is deprecated
     *
     * @returns {boolean}
     */
    isDeprecated() {
        return this._deprecated;
    }

    /**
     * Build the deprecation message for a given service id
     *
     * @param {string} id
     *
     * @returns {string}
     */
    getDeprecationMessage(id) {
        return this._deprecationTemplate.replace(/%service_id%/g, id);
    }

    /**
     * Sets a configurator to be called after the service is initialized
     *
     * @param {string|Array|Function} configurator
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    setConfigurator(configurator) {
        if (isString(configurator) && -1 !== configurator.indexOf('#')) {
            configurator = configurator.split('#', 2);
        }

        this._configurator = configurator;

        return this;
    }

    /**
     * Gets the configurator for this service
     *
     * @returns {string|Array|Function}
     */
    getConfigurator() {
        return this._configurator;
    }
};
