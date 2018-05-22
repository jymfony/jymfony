const Alias = Jymfony.Component.DependencyInjection.Alias;
const Compiler = Jymfony.Component.DependencyInjection.Compiler.Compiler;
const PassConfig = Jymfony.Component.DependencyInjection.Compiler.PassConfig;
const Container = Jymfony.Component.DependencyInjection.Container;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const BadMethodCallException = Jymfony.Component.DependencyInjection.Exception.BadMethodCallException;
const InvalidArgumentException = Jymfony.Component.DependencyInjection.Exception.InvalidArgumentException;
const ServiceNotFoundException = Jymfony.Component.DependencyInjection.Exception.ServiceNotFoundException;
const RealServiceInstantiator = Jymfony.Component.DependencyInjection.LazyProxy.RealServiceInstantiator;
const Reference = Jymfony.Component.DependencyInjection.Reference;

const fs = require('fs');

/**
 * @memberOf Jymfony.Component.DependencyInjection
 */
class ContainerBuilder extends Container {
    /**
     * Creates a new ContainerBuilder
     *
     * @param parameterBag
     * @constructor
     */
    __construct(parameterBag) {
        super.__construct(parameterBag);

        /**
         * @type {Object<string, Jymfony.Component.DependencyInjection.ExtensionInterface>}
         * @private
         */
        this._extensions = {};

        /**
         * @type {Object<string, [Object<string, *>]>}
         * @private
         */
        this._extensionConfigs = {};

        /**
         * @type {Object<string, Jymfony.Component.DependencyInjection.Definition>}
         * @private
         */
        this._definitions = {};

        /**
         * @type {Object<string, Jymfony.Component.DependencyInjection.Alias>}
         * @private
         */
        this._aliasDefinitions = {};

        /**
         * @type {Jymfony.Component.Config.Resource.ResourceInterface[]}
         * @private
         */
        this._resources = [];

        /**
         * @type {boolean}
         * @private
         */
        this._trackResources = ReflectionClass.exists('Jymfony.Component.Config.Resource.ResourceInterface');

        this.setDefinition(
            'service_container',
            (new Definition('Jymfony.Component.DependencyInjection.Container'))
                .setSynthetic(true)
                .setPublic(true)
        );
    }

    /**
     * Sets the track resources flag.
     *
     * Set this to false if you don't want to depend on
     * the config package
     *
     * @param {boolean} track
     */
    setResourceTracking(track) {
        this._trackResources = !! track;
    }

    /**
     * Checks if resources are tracked.
     *
     * @returns {boolean}
     */
    isTrackingResources() {
        return this._trackResources;
    }

    /**
     * Registers an extension
     * @param {Jymfony.Component.DependencyInjection.Extension.ExtensionInterface} extension
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
        const extension = this._extensions[name];
        if (extension) {
            return extension;
        }

        throw new LogicException(`Container extension ${name} is not registered`);
    }

    /**
     * Returns all registered extensions
     *
     * @returns {Object<string, Jymfony.Component.DependencyInjection.Extension.ExtensionInterface>}
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
     * Returns an array of resources used to build this configuration
     *
     * @returns {Jymfony.Component.Config.Resource.ResourceInterface[]}
     */
    getResources() {
        const seen = {};
        return this._resources.filter(o => {
            if (seen[o.toString()]) {
                return false;
            }

            seen[o.toString()] = true;
            return true;
        });
    }

    /**
     * Adds a resource for this configuration.
     *
     * @param {Jymfony.Component.Config.Resource.ResourceInterface} resource A resource instance
     *
     * @returns {Jymfony.Component.DependencyInjection.ContainerBuilder} The current instance
     */
    addResource(resource) {
        if (! this.isTrackingResources()) {
            return this;
        }

        this._resources.push(resource);
        return this;
    }

    /**
     * Adds the object class hierarchy as resources.
     *
     * @param {*} object An object instance
     *
     * @returns {Jymfony.Component.DependencyInjection.ContainerBuilder}
     */
    addObjectResource(object) {
        if (this.isTrackingResources()) {
            this.addClassResource(new ReflectionClass(object));
        }

        return this;
    }

    /**
     * Adds the given class hierarchy as resources.
     *
     * @param {ReflectionClass} reflClass
     *
     * @returns {Jymfony.Component.DependencyInjection.ContainerBuilder}
     */
    addClassResource(reflClass) {
        if (! this.isTrackingResources()) {
            return this;
        }

        do {
            if (reflClass.filename && fs.statSync(reflClass.filename).isFile()) {
                this.addResource(new Jymfony.Component.Config.Resource.FileResource(reflClass.filename));
            }
        } while (reflClass = reflClass.getParentClass());

        return this;
    }

    /**
     * Loads the configuration for an extension
     *
     * @param {string} extension
     * @param {Object<string, *>} values
     *
     * @returns {Jymfony.Component.DependencyInjection.ContainerBuilder}
     */
    loadFromExtension(extension, values = []) {
        if (this.frozen) {
            throw new BadMethodCallException('Cannot load from an extension on a frozen container');
        }

        const namespace = this.getExtension(extension).alias;
        if (undefined === this._extensionConfigs[namespace]) {
            this._extensionConfigs[namespace] = [];
        }

        this._extensionConfigs[namespace].push(values);
        return this;
    }

    /**
     * Add a compilation pass
     *
     * @param {Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface} pass
     * @param {string} type
     * @param {int} priority
     *
     * @returns {Jymfony.Component.DependencyInjection.ContainerBuilder}
     */
    addCompilerPass(pass, type = PassConfig.TYPE_BEFORE_OPTIMIZATION, priority = 0) {
        const compiler = this.getCompiler();
        compiler.addPass(pass, type, priority);

        return this;
    }

    /**
     * Get the compiler
     *
     * @returns {Jymfony.Component.DependencyInjection.Compiler.Compiler}
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
        id = Container.normalizeId(id);

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
        id = Container.normalizeId(id);
        delete this._definitions[id];
    }

    /**
     * Check if has a service
     *
     * @param {string} id
     *
     * @returns {boolean}
     */
    has(id) {
        id = Container.normalizeId(id);

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
        id = Container.normalizeId(id);

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
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     */
    merge(container) {
        if (this.frozen) {
            throw new BadMethodCallException('Cannot merge on a frozen container');
        }

        this.addDefinitions(container._definitions);
        this.addAliases(container._aliasDefinitions);
        this.parameterBag.add(container.parameterBag.all(), false);

        for (const resource of container.getResources()) {
            this.addResource(resource);
        }

        for (const name of Object.keys(this._extensions)) {
            if (undefined === this._extensionConfigs[name]) {
                this._extensionConfigs[name] = [];
            }

            this._extensionConfigs[name].push(container.getExtensionConfig(name));
        }
    }

    /**
     * Returns the configuration object for the given extension.
     *
     * @param {string} name
     *
     * @returns {Object}
     */
    getExtensionConfig(name) {
        if (undefined === this._extensionConfigs[name]) {
            this._extensionConfigs[name] = [];
        }

        return [ ...this._extensionConfigs[name] ];
    }

    /**
     * Prepends a configuration object to the extension configs
     *
     * @param {string} name
     * @param {Object} config
     */
    prependExtensionConfig(name, config) {
        if (undefined === this._extensionConfigs[name]) {
            this._extensionConfigs[name] = [];
        }

        this._extensionConfigs[name].unshift(config);
    }

    /**
     * Compile the container
     *
     *  - Merge extensions configurations
     *  - Resolve parameters value
     *  - Freeze
     */
    compile() {
        const compiler = this.getCompiler();
        compiler.compile(this);

        this._extensionConfigs = {};

        super.compile();
    }

    /**
     * @inheritDoc
     */
    getServiceIds() {
        const ids = new Set([ ...Object.keys(this._definitions), ...Object.keys(this._aliasDefinitions), ...super.getServiceIds() ]);
        return Array.from(ids.values());
    }

    /**
     * Add service aliases
     *
     * @param {Object<string, string|Jymfony.Component.DependencyInjection.Alias>} aliases
     */
    addAliases(aliases) {
        for (const [ name, id ] of __jymfony.getEntries(aliases)) {
            this.setAlias(name, id);
        }
    }

    /**
     * Set service aliases
     *
     * @param {Object<string, string|Jymfony.Component.DependencyInjection.Alias>} aliases
     */
    setAliases(aliases) {
        this._aliasDefinitions = {};
        this.addAliases(aliases);
    }

    /**
     * Sets an alias for an existing service.
     *
     * @param {string} alias
     * @param {string|Jymfony.Component.DependencyInjection.Alias} id
     */
    setAlias(alias, id) {
        id = Container.normalizeId(id);
        alias = Container.normalizeId(alias);

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
        delete this._aliasDefinitions[alias];
    }

    /**
     * Checks whether an alias exists
     *
     * @param {string} alias
     *
     * @returns {boolean}
     */
    hasAlias(alias) {
        return undefined !== this._aliasDefinitions[alias.toString()];
    }

    /**
     * Get all defined aliases
     *
     * @returns {Object<string, Jymfony.Component.DependencyInjection.Alias>}
     */
    getAliases() {
        return Object.assign({}, this._aliasDefinitions);
    }

    /**
     * Gets an alias
     *
     * @param {string} id
     *
     * @returns {Jymfony.Component.DependencyInjection.Alias}
     */
    getAlias(id) {
        id = Container.normalizeId(id);

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
     * @returns {Jymfony.Component.DependencyInjection.Definition} A Definition instance
     */
    register(id, class_ = undefined) {
        id = Container.normalizeId(id);

        return this.setDefinition(id, new Definition(class_));
    }

    /**
     * Adds the service definitions.
     *
     * @param {Jymfony.Component.DependencyInjection.Definition[]} definitions
     */
    addDefinitions(definitions) {
        for (const [ id, definition ] of __jymfony.getEntries(definitions)) {
            this.setDefinition(id, definition);
        }
    }

    /**
     * Sets the service definitions.
     *
     * @param {Jymfony.Component.DependencyInjection.Definition[]} definitions
     */
    setDefinitions(definitions) {
        this._definitions = {};
        this.addDefinitions(definitions);
    }

    /**
     * Gets all service definitions.
     *
     * @returns {Object<string, Jymfony.Component.DependencyInjection.Definition>}
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
     * @returns {Jymfony.Component.DependencyInjection.Definition} the service definition
     *
     * @throws BadMethodCallException When this ContainerBuilder is frozen
     */
    setDefinition(id, definition) {
        if (this.frozen) {
            throw new BadMethodCallException('Cannot add a definition to a frozen container');
        }

        id = Container.normalizeId(id);
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
        id = Container.normalizeId(id);

        return undefined !== this._definitions[id.toString()];
    }

    /**
     * Gets a service definition.
     *
     * @param {string} id
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     *
     * @throws {Jymfony.Component.DependencyInjection.Exception.ServiceNotFoundException} If the service definition does not exist
     */
    getDefinition(id) {
        id = Container.normalizeId(id);

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
     * @returns {Jymfony.Component.DependencyInjection.Definition} A Definition instance
     *
     * @throws {Jymfony.Component.DependencyInjection.Exception.ServiceNotFoundException} If the service definition does not exist
     */
    findDefinition(id) {
        id = Container.normalizeId(id);

        while (this._aliasDefinitions[id]) {
            id = this._aliasDefinitions[id].toString();
        }

        return this.getDefinition(id);
    }
    /**
     * Creates a service for a service definition.
     *
     * @param {Jymfony.Component.DependencyInjection.Definition} definition
     * @param {undefined|string} id
     * @param {boolean} tryProxy
     *
     * @returns {*} The service described by the service definition
     *
     * @throws {Jymfony.Component.DependencyInjection.Exception.RuntimeException} When the factory definition is incomplete or when the service is a synthetic service
     * @throws {Jymfony.Component.DependencyInjection.Exception.InvalidArgumentException} When configure callable is not callable
     */
    _createService(definition, id, tryProxy = true) {
        if (definition.isSynthetic()) {
            throw new RuntimeException('You have requested a synthetic service ("' + id + '"). The DIC does not know how to construct this service.');
        }

        if (definition.isDeprecated()) {
            __jymfony.trigger_deprecated(definition.getDeprecationMessage(id));
        }

        if (tryProxy && definition.isLazy()) {
            const proxy = this._getProxyInstantiator()
                .instantiateProxy(this, definition, id, () => this._createService(definition, id, false));

            this._shareService(definition, proxy, id);
            return proxy;
        }

        const parameterBag = this.parameterBag;

        const args = this._resolveServices(parameterBag.unescapeValue(parameterBag.resolveValue(definition.getArguments())));
        let factory = definition.getFactory();
        const module = definition.getModule();

        let service;

        if (module) {
            const [ m, property ] = module;

            service = require(m);
            if (undefined !== property) {
                service = new service[property](...args);
            }
        } else if (factory) {
            if (isArray(factory)) {
                factory = getCallableFromArray([ this._resolveServices(parameterBag.resolveValue(factory[0])), factory[1] ]);
            } else if (!isFunction(factory)) {
                throw new RuntimeException('Cannot create service "' + id + '" because of invalid factory');
            }

            service = factory(...args);
        } else {
            const class_ = parameterBag.resolveValue(definition.getClass());
            const constructor = ReflectionClass.getClass(class_);

            service = new constructor(...args);
        }

        if (tryProxy || ! definition.isLazy()) {
            this._shareService(definition, service, id);
        }

        const properties = this._resolveServices(parameterBag.unescapeValue(parameterBag.resolveValue(definition.getProperties())));
        for (const [ name, value ] of __jymfony.getEntries(properties)) {
            service[name] = value;
        }

        for (const call of definition.getMethodCalls()) {
            this._callMethod(service, call);
        }

        let configurator = definition.getConfigurator();
        if (configurator) {
            if (isArray(configurator)) {
                configurator[0] = parameterBag.resolveValue(configurator[0]);

                if (configurator[0] instanceof Reference) {
                    configurator[0] = this.get(configurator[0].toString(), configurator[0].invalidBehavior);
                } else if (configurator[0] instanceof Definition) {
                    configurator[0] = this._createService(configurator[0], undefined);
                }

                configurator = getCallableFromArray(configurator);
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
        const tags = {};

        for (const [ id, definition ] of __jymfony.getEntries(this._definitions)) {
            if (definition.hasTag(name)) {
                tags[id] = definition.getTag(name);
            }
        }

        return tags;
    }

    /**
     * Returns all the defined tags
     *
     * @returns {[string]}
     */
    findTags() {
        const tags = new Set();
        for (const definition of this._definitions) {
            for (const tag of Object.keys(definition.getTags())) {
                tags.add(tag);
            }
        }

        return Array.from(tags);
    }

    /**
     * @final
     */
    log(pass, message) {
        this.getCompiler().log(pass, message);
    }

    /**
     * Returns the service conditionals
     *
     * @param {*} value
     *
     * @returns {Array}
     */
    static getServiceConditionals(value) {
        const services = new Set();

        if (isArray(value)) {
            for (const v of value) {
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
     * @returns {Jymfony.Component.DependencyInjection.LazyProxy.InstantiatorInterface}
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
        const services = ContainerBuilder.getServiceConditionals(call[1]);

        for (const service of services) {
            if (! this.has(service)) {
                return;
            }
        }

        call = getCallableFromArray([ service, call[0] ]);
        call.apply(service, this._resolveServices(this.parameterBag.unescapeValue(this.parameterBag.resolveValue(call[1]))));
    }

    /**
     * Shares a service in the container
     *
     * @param {Jymfony.Component.DependencyInjection.Definition} definition
     * @param {*} service
     * @param {string} id
     *
     * @private
     */
    _shareService(definition, service, id) {
        if (! definition.isShared()) {
            return;
        }

        this._services[id] = service;
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
            for (const [ k, v ] of value.entries()) {
                value.set(k, this._resolveServices(v));
            }
        } else if (value instanceof Reference) {
            value = this.get(value.toString(), value.invalidBehavior);
        } else if (value instanceof Definition) {
            value = this._createService(value, undefined);
        }

        return value;
    }
}

module.exports = ContainerBuilder;
