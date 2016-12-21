const Alias = Jymfony.DependencyInjection.Alias;
const Compiler = Jymfony.DependencyInjection.Compiler.Compiler;
const Container = Jymfony.DependencyInjection.Container;
const Definition = Jymfony.DependencyInjection.Definition;
const BadMethodCallException = Jymfony.DependencyInjection.Exception.BadMethodCallException;
const InvalidArgumentException = Jymfony.DependencyInjection.Exception.InvalidArgumentException;
const ServiceNotFoundException = Jymfony.DependencyInjection.Exception.ServiceNotFoundException;
const RealServiceInstantiator = Jymfony.DependencyInjection.LazyProxy.RealServiceInstantiator;
const Reference = Jymfony.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.DependencyInjection
 * @type {Jymfony.DependencyInjection.ContainerBuilder}
 */
module.exports = class ContainerBuilder extends Container {
    /**
     * Creates a new ContainerBuilder
     *
     * @param parameterBag
     * @constructor
     */
    constructor(parameterBag) {
        super(parameterBag);

        /**
         * @type {Object<string, ExtensionInterface>}
         * @private
         */
        this._extensions = {};

        /**
         * @type {Object<string, Array<Object<string, *>>>}
         * @private
         */
        this._extensionConfigs = {};

        /**
         * @type {Object<string, Definition>}
         * @private
         */
        this._definitions = {};

        /**
         * @type {Object<string, string>}
         * @private
         */
        this._aliasDefinitions = {};
    }

    /**
     * Registers an extension
     * @param extension
     */
    registerExtension(extension) {
        this._extensions[extension.alias] = extension;
    }

    /**
     * Returns an extension by alias
     *
     * @param name
     * @returns {*}
     */
    getExtension(name) {
        let extension = this._extensions[name];
        if (extension) {
            return extension;
        }

        throw new LogicException(`Container extension ${name} is not registered`);
    }

    /**
     * Returns all registered extensions
     *
     * @returns {{}}
     */
    getExtensions() {
        // Clone object
        return Object.assign({}, this._extensions);
    }

    /**
     * Checks if we have an extension
     *
     * @param name
     * @returns {boolean}
     */
    hasExtension(name) {
        return this._extensions[name] !== undefined;
    }

    /**
     * Loads the configuration for an extension
     *
     * @param extension
     * @param values
     *
     * @returns {Jymfony.DependencyInjection.ContainerBuilder}
     */
    loadFromExtension(extension, values = []) {
        if (this.frozen) {
            throw new BadMethodCallException('Cannot load from an extension on a frozen container');
        }

        let namespace = this.getExtension(extension).alias;
        if (! this._extensionConfigs[namespace]) {
            this._extensionConfigs[namespace] = [];
        }

        this._extensionConfigs[namespace].push(values);
        return this;
    }

    /**
     * Add a compilation pass
     *
     * @param {CompilerPassInterface} pass
     * @param type
     * @param {int} priority
     *
     * @returns {Jymfony.DependencyInjection.ContainerBuilder}
     */
    addCompilerPass(pass, type, priority = 0) {
        let compiler = this.getCompiler();
        compiler.addPass(pass, type, priority);

        return this;
    }

    /**
     * Get the compiler
     *
     * @returns {Jymfony.DependencyInjection.Compiler}
     */
    getCompiler() {
        if (undefined === this._compiler) {
            this._compiler = new Compiler();
        }

        return this._compiler;
    }

    /**
     * Set a service
     *
     * @param {string} id
     * @param {*} service
     *
     * @throws BadMethodCallException When trying to set a non-synthetic service into a frozen container
     */
    set(id, service) {
        id = id.toLowerCase();

        if (this.frozen && undefined !== this._definitions[id] && ! this._definitions[id].isSynthetic()) {
            throw new BadMethodCallException('Cannot set a non-synthetic service into a frozen container');
        }

        delete this._definitions[id];
        delete this._aliasDefinitions[id];

        super.set(id, service);
    }

    /**
     * Remove a definition
     *
     * @param {string} id
     */
    removeDefinition(id) {
        delete this._definitions[id.toLowerCase()];
    }

    /**
     * Check if has a service
     *
     * @param {string} id
     *
     * @returns {boolean}
     */
    has(id) {
        id = id.toLowerCase();

        return undefined !== this._definitions[id] || undefined !== this._aliasDefinitions[id] || super.has(id);
    }

    /**
     * Gets a service
     *
     * @param {string} id
     * @param {int} invalidBehavior
     *
     * @returns {*}
     */
    get(id, invalidBehavior = Container.EXCEPTION_ON_INVALID_REFERENCE) {
        id = id.toLowerCase();

        let service = super.get(id, Container.NULL_ON_INVALID_REFERENCE);
        if (undefined !== service) {
            return service;
        }

        if (undefined === this._definitions[id] && undefined !== this._aliasDefinitions[id]) {
            return this.get(this._aliasDefinitions[id], invalidBehavior);
        }

        let definition;
        try {
            definition = this.getDefinition(id);
        } catch (err) {
            if (Container.EXCEPTION_ON_INVALID_REFERENCE !== invalidBehavior) {
                return null;
            }

            throw err;
        }

        this._loading[id] = true;
        try {
            service = this._createService(definition, id);
        } finally {
            delete this._loading[id];
        }

        return service;
    }

    /**
     * Merges a container into this one
     *
     * Services definition are overwritten by the merged container,
     * while parameters are kept from this one
     *
     * @param {Jymfony.DependencyInjection.ContainerBuilder} container
     */
    merge(container) {
        if (this.frozen) {
            throw new BadMethodCallException('Cannot merge on a frozen container');
        }

        this.addDefinitions(container._definitions);
        this.addAliases(container._aliasDefinitions);
        this.parameterBag.add(container.parameterBag.all(), false);


        for (let name of this._extensions.keys()) {
            if (undefined === this._extensionConfigs[name]) {
                this._extensionConfigs[name] = {};
            }

            Object.assign(this._extensionConfigs[name], container.getExtensionConfig(name));
        }
    }

    /**
     * Returns the configuration object for the given extension.
     *
     * @param name
     *
     * @returns {Object}
     */
    getExtensionConfig(name) {
        if (undefined === this._extensionConfigs[name]) {
            this._extensionConfigs[name] = {};
        }

        return Object.assign({}, this._extensionConfigs[name]);
    }

    /**
     * Prepends a configuration object to the extension configs
     *
     * @param {string} name
     * @param {Object} config
     */
    prependExtensionConfig(name, config) {
        if (undefined === this._extensionConfigs[name]) {
            this._extensionConfigs[name] = {};
        }

        this._extensionConfigs[name] = Object.assign({}, this._extensionConfigs[name]);
    }

    /**
     * Compile the container
     *
     *  - Merge extensions configurations
     *  - Resolve parameters value
     *  - Freeze
     */
    compile() {
        let compiler = this.getCompiler();
        compiler.compile(this);

        this._extensionConfigs = {};

        super.compile();
    }

    /**
     * @inheritDoc
     */
    getServiceIds() {
        let ids = new Set([...Object.keys(this._definitions), ...Object.keys(this._aliasDefinitions), ...super.getServiceIds()]);
        return Array.from(ids.values());
    }

    /**
     * Add service aliases
     *
     * @param {Array<string, string|Alias>} aliases
     */
    addAliases(aliases) {
        for (let [name, id] of __jymfony.getEntries(aliases)) {
            this.setAlias(name, id);
        }
    }

    /**
     * Set service aliases
     *
     * @param {Array<string, string|Alias>} aliases
     */
    setAliases(aliases) {
        this._aliasDefinitions = {};
        this.addAliases(aliases);
    }

    /**
     * Sets an alias for an existing service.
     *
     * @param {string} alias
     * @param {string|Jymfony.DependencyInjection.Alias} id
     */
    setAlias(alias, id) {
        alias = alias.toLowerCase();

        if (isString(id)) {
            id = new Alias(id);
        } else if (! (id instanceof Alias)) {
            throw new InvalidArgumentException('id must be a string, or an Alias object');
        }

        if (alias === id.toString()) {
            throw new InvalidArgumentException('An alias cannot reference itself, got a circular reference on "'+alias+'"');
        }

        delete this._definitions[alias];
        this._aliasDefinitions[alias] = id;
    }

    /**
     * Removes an alias
     *
     * @param {string} alias
     */
    removeAlias(alias) {
        delete this._aliasDefinitions[alias.toLowerCase()];
    }

    /**
     * Checks whether an alias exists
     *
     * @param {string} alias
     *
     * @returns {boolean}
     */
    hasAlias(alias) {
        return undefined !== this._aliasDefinitions[alias.toLowerCase()];
    }

    /**
     * Get all defined aliases
     *
     * @returns {Object<string, Alias>}
     */
    getAliases() {
        return Object.assign({}, this._aliasDefinitions);
    }

    /**
     * Gets an alias
     *
     * @param {string} id
     *
     * @returns {Alias}
     */
    getAlias(id) {
        id = id.toLowerCase();

        if (undefined === this._aliasDefinitions[id]) {
            throw new InvalidArgumentException('The service alias "'+id+' does not exist');
        }

        return this._aliasDefinitions[id];
    }

    /**
     * Registers a service definition.
     *
     * This methods allows for simple registration of service definition
     * with a fluid interface.
     *
     * @param {string} id
     * @param {string|null} class_
     *
     * @returns {Jymfony.DependencyInjection.Definition} A Definition instance
     */
    register(id, class_) {
        return this.setDefinition(id, new Definition(class_));
    }

    /**
     * Adds the service definitions.
     *
     * @param {Jymfony.DependencyInjection.Definition[]} definitions
     */
    addDefinitions(definitions) {
        for (let [id, definition] of __jymfony.getEntries(definitions)) {
            this.setDefinition(id, definition);
        }
    }

    /**
     * Sets the service definitions.
     *
     * @param {Jymfony.DependencyInjection.Definition[]} definitions
     */
    setDefinitions(definitions) {
        this._definitions = {};
        this.addDefinitions(definitions);
    }

    /**
     * Gets all service definitions.
     *
     * @returns {Object<string, Jymfony.DependencyInjection.Definition>}
     */
    getDefinitions() {
        return Object.assign({}, this._definitions);
    }

    /**
     * Sets a service definition.
     *
     * @param {string} id
     * @param {Definition} definition
     *
     * @returns {Jymfony.DependencyInjection.Definition} the service definition
     *
     * @throws BadMethodCallException When this ContainerBuilder is frozen
     */
    setDefinition(id, definition) {
        if (this.frozen) {
            throw new BadMethodCallException('Cannot add a definition to a frozen container');
        }

        id = id.toLowerCase();
        delete this._aliasDefinitions[id];

        return this._definitions[id] = definition;
    }

    /**
     * Returns true if a service definition exists under the given identifier.
     *
     * @param {string} id
     *
     * @returns {boolean}
     */
    hasDefinition(id) {
        return undefined !== this._definitions[id.toLowerCase()];
    }

    /**
     * Gets a service definition.
     *
     * @param {string} id
     *
     * @returns {Jymfony.DependencyInjection.Definition}
     *
     * @throws ServiceNotFoundException if the service definition does not exist
     */
    getDefinition(id) {
        id = id.toLowerCase();

        if (undefined === this._definitions[id]) {
            throw new ServiceNotFoundException(id);
        }

        return this._definitions[id];
    }

    /**
     * Gets a service definition by id or alias.
     * The method "unaliases" recursively to return a Definition instance.
     *
     * @param {string} id
     *
     * @returns {Jymfony.DependencyInjection.Definition} A Definition instance
     *
     * @throws ServiceNotFoundException if the service definition does not exist
     */
    findDefinition(id)
    {
        id = id.toLowerCase();

        while (this._aliasDefinitions[id]) {
            id = this._aliasDefinitions[id].toString();
        }

        return this.getDefinition(id);
    }
    /**
     * Creates a service for a service definition.
     *
     * @param {Jymfony.DependencyInjection.Definition} definition
     * @param {string} id
     * @param {boolean} tryProxy
     *
     * @return {*} The service described by the service definition
     *
     * @throws RuntimeException When the factory definition is incomplete or when the service is a synthetic service
     * @throws InvalidArgumentException When configure callable is not callable
     */
    _createService(definition, id, tryProxy = true) {
        if (definition.isSynthetic()) {
            throw new RuntimeException('You have requested a synthetic service ("' + id + '"). The DIC does not know how to construct this service.');
        }

        if (definition.isDeprecated()) {
            __jymfony.trigger_deprecated(definition.getDeprecationMessage(id));
        }

        if (tryProxy && definition.isLazy()) {
            let proxy = this._getProxyInstantiator()
                .instantiateProxy(this, definition, id, () => this._createService(definition, id, false));

            this._shareService(definition, proxy, id);
            return proxy;
        }

        let parameterBag = this.parameterBag;

        let file = definition.getFile();
        if (file) {
            require(parameterBag.resolveValue(file));
        }

        let args = this._resolveServices(parameterBag.unescapeValue(parameterBag.resolveValue(definition.getArguments())));
        let factory = definition.getFactory();

        let service;

        if (factory) {
            if (isArray(factory)) {
                factory = getCallableFromArray([this._resolveServices(parameterBag.resolveValue(factory[0])), factory[1]]);
            } else if (!isFunction(factory)) {
                throw new RuntimeException('Cannot create service "' + id + '" because of invalid factory');
            }

            service = factory.apply(null, args);
        } else {
            let class_ = parameterBag.resolveValue(definition.getClass());

            let parts = class_.split('.');
            let constructor = global;

            let part;
            while (part = parts.pop()) {
                constructor = constructor[part];
            }

            service = new constructor(...args);
        }

        if (tryProxy || ! definition.isLazy()) {
            this._shareService(definition, service, id);
        }

        let properties = this._resolveServices(parameterBag.unescapeValue(parameterBag.resolveValue(definition.getProperties())));
        for (let [name, value] of __jymfony.getEntries(properties)) {
            service[name] = value;
        }

        for (let call of definition.getMethodCalls()) {
            this._callMethod(service, call);
        }

        let configurator = definition.getConfigurator();
        if (configurator) {
            if (isArray(configurator)) {
                configurator[0] = parameterBag.resolveValue(configurator[0]);
            }

            if (configurator[0] instanceof Reference) {
                configurator[0] = this.get(configurator[0].toString(), configurator[0].invalidBehavior);
            } else if (configurator[0] instanceof Definition) {
                configurator[0] = this._createService(configurator[0], null);
            }

            if (! isFunction(configurator)) {
                throw new InvalidArgumentException('The configure callable for class "'+service.constructor.name+'" is not a callable.');
            }

            configurator(service);
        }

        return service;
    }

    /**
     * Returns service ids for a given tag
     *
     * @param name
     *
     * @returns {Object<string, Object>}
     */
    findTaggedServiceIds(name) {
        let tags = {};

        for (let [id, definition] of __jymfony.getEntries(this._definitions)) {
            if (definition.hasTag(name)) {
                tags[id] = definition.getTag(name);
            }
        }

        return tags;
    }

    /**
     * Returns all the defined tags
     *
     * @returns {string[]}
     */
    findTags() {
        let tags = new Set;
        for (let definition of this._definitions) {
            for (let tag of Object.keys(definition.getTags())) {
                tags.add(tag);
            }
        }

        return Array.from(tags);
    }

    /**
     * Returns the service conditionals
     *
     * @param {*} value
     *
     * @returns {Array}
     */
    static getServiceConditionals(value) {
        let services = new Set;

        if (isArray(value)) {
            for (let v of value) {
                ContainerBuilder.getServiceConditionals(v).forEach(service => services.add(service));
            }
        } else if (value instanceof Reference && value.invalidBehavior === Container.IGNORE_ON_INVALID_REFERENCE) {
            services.add(value.toString());
        }

        return Array.from(services);
    }

    /**
     * Retrieve the currently set proxy instantiator or create a new one
     *
     * @returns {InstantiatorInterface}
     *
     * @private
     */
    _getProxyInstantiator() {
        if (undefined === this._proxyInstantiator) {
            this._proxyInstantiator = new RealServiceInstantiator();
        }

        return this._proxyInstantiator;
    }

    /**
     * Call a method when creating service
     *
     * @param service
     * @param call
     *
     * @private
     */
    _callMethod(service, call) {
        let services = ContainerBuilder.getServiceConditionals(call[1]);

        for (let service of services) {
            if (! this.has(service)) {
                return;
            }
        }

        call = getCallableFromArray([service, call[0]]);
        call.apply(service, this._resolveServices(this.parameterBag.unescapeValue(this.parameterBag.resolveValue(call[1]))));
    }

    /**
     * Shares a service in the container
     *
     * @param {Definition} definition
     * @param {*} service
     * @param {string} id
     *
     * @private
     */
    _shareService(definition, service, id) {
        if (! definition.isShared()) {
            return;
        }

        this._services[id.toLowerCase()] = service;
    }

    /**
     * Replaces service references by the real service instance
     *
     * @param {*} value
     *
     * @returns {*}
     *
     * @private
     */
    _resolveServices(value) {
        if (value instanceof Map) {
            for (let [k, v] of value.entries()) {
                value.set(k, this._resolveServices(v));
            }
        } else if (value instanceof Reference) {
            value = this.get(value.toString(), value.invalidBehavior);
        } else if (value instanceof Definition) {
            value = this._createService(value, null);
        }

        return value;
    }
};
