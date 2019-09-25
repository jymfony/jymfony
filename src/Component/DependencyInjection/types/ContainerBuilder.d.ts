declare namespace Jymfony.Component.DependencyInjection {
    import Compiler = Jymfony.Component.DependencyInjection.Compiler.Compiler;
    import CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
    import InstantiatorInterface = Jymfony.Component.DependencyInjection.LazyProxy.InstantiatorInterface;
    import ParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag;
    import ExtensionInterface = Jymfony.Component.DependencyInjection.Extension.ExtensionInterface;
    import ResourceInterface = Jymfony.Component.Config.Resource.ResourceInterface;
    type ServiceIdentifier = string|symbol|Newable<any>;

    export class ContainerBuilder extends Container {
        private _extensions: Record<string, ExtensionInterface>;
        private _extensionConfigs: Record<string, Record<string, any>[]>;
        private _definitions: Record<string, Definition>;
        private _aliasDefinitions: Record<string, Alias>;
        private _resources: ResourceInterface[];
        private _trackResources: boolean;
        private _compiler: Compiler;
        private _autoconfiguredInstanceof: Record<string, ChildDefinition>;

        constructor(parameterBag?: ParameterBag);
        __construct(parameterBag?: ParameterBag);

        /**
         * Sets the track resources flag.
         */
        setResourceTracking(track: boolean): void;

        /**
         * Checks if resources are tracked.
         */
        isTrackingResources(): boolean;

        /**
         * Registers an extension.
         */
        registerExtension(extension: ExtensionInterface): void;

        /**
         * Returns an extension by alias.
         *
         * @throws {LogicException}
         */
        getExtension(name: string): ExtensionInterface;

        /**
         * Returns all registered extensions.
         */
        getExtensions(): Record<string, ExtensionInterface>

        /**
         * Checks if we have an extension.
         */
        hasExtension(name: string): boolean;

        /**
         * Returns an array of resources used to build this configuration.
         */
        getResources(): ResourceInterface[];

        /**
         * Adds a resource for this configuration.
         */
        addResource(resource: ResourceInterface): this;

        /**
         * Adds the object class hierarchy as resources.
         *
         * @param object An object instance
         */
        addObjectResource(object: any): this;

        /**
         * Retrieves the requested reflection class and registers it for resource tracking.
         *
         * @throws {ReflectionException} when a parent class/interface/trait is not found and $throw is true
         *
         * @final
         */
        getReflectionClass(Class: string, Throw?: boolean): ReflectionClass;

        /**
         * Adds the given class hierarchy as resources.
         */
        addClassResource(reflClass: ReflectionClass): this;

        /**
         * Checks whether the requested file or directory exists and registers the result for resource tracking.
         *
         * @param path The file or directory path for which to check the existence
         * @param trackContents Whether to track contents of the given resource. If a string is passed,
         *                      it will be used as pattern for tracking contents of the requested directory
         *
         * @final
         */
        fileExists(path: string, trackContents?: boolean|string): boolean;

        /**
         * Loads the configuration for an extension.
         */
        loadFromExtension(extension: string, values?: Record<string, any>): this;

        /**
         * Adds a compilation pass.
         */
        addCompilerPass(pass: CompilerPassInterface, type?: string, priority?: number): this;

        /**
         * Gets the compiler.
         */
        getCompiler(): Compiler;

        /**
         * Sets a service.
         *
         * @throws {Jymfony.Component.DependencyInjection.Exception.BadMethodCallException} When trying to set a non-synthetic service into a frozen container
         */
        set(id: ServiceIdentifier, service: any): void;

        /**
         * Removes a definition.
         */
        removeDefinition(id: string): void;

        /**
         * Checks if has a service.
         */
        has(id: ServiceIdentifier): boolean;

        /**
         * Gets a service.
         */
        get<T>(id: Newable<T>, invalidBehavior?: number): T;
        get(id: string|symbol, invalidBehavior?: number): any;

        /**
         * Merges a container into this one.
         * Services definition are overwritten by the merged container,
         * while parameters are kept from this one.
         */
        merge(container: ContainerBuilder): void;

        /**
         * Returns the configuration object for the given extension.
         */
        getExtensionConfig(name: string): any;

        /**
         * Prepends a configuration object to the extension configs.
         */
        prependExtensionConfig(name: string, config: any): void;

        /**
         * Compiles the container:
         *
         *  - Merge extensions configurations
         *  - Resolve parameters value
         *  - Freeze
         */
        compile(): void;

        /**
         * @inheritdoc
         */
        getServiceIds(): string[];

        /**
         * Adds service aliases.
         */
        addAliases(aliases: Record<string, string|Alias>): void;

        /**
         * Sets service aliases.
         */
        setAliases(aliases: Record<string, string|Alias>): void;

        /**
         * Sets an alias for an existing service.
         */
        setAlias(alias: string, id: string|Alias): Alias;

        /**
         * Removes an alias.
         */
        removeAlias(alias: string): void;

        /**
         * Checks whether an alias exists.
         */
        hasAlias(alias: string|Newable<any>): boolean;

        /**
         * Gets all defined aliases.
         */
        getAliases(): Record<string, Alias>;

        /**
         * Gets an alias.
         */
        getAlias(id: string): Alias;

        /**
         * Registers a service definition.
         * This methods allows for simple registration of service definition
         * with a fluid interface.
         */
        register(id: ServiceIdentifier, class_?: string|Newable<any>): Definition;

        /**
         * Adds the service definitions.
         */
        addDefinitions(definitions: Record<string, Definition>): void;

        /**
         * Sets the service definitions.
         */
        setDefinitions(definitions: Record<string, Definition>): void;

        /**
         * Gets all service definitions.
         */
        getDefinitions(): Record<string, Definition>;

        /**
         * Sets a service definition.
         *
         * @throws {Jymfony.Component.DependencyInjection.Exception.BadMethodCallException} When this ContainerBuilder is frozen
         */
        setDefinition(id: ServiceIdentifier, definition: Definition): Definition;

        /**
         * Returns true if a service definition exists under the given identifier.
         */
        hasDefinition(id: ServiceIdentifier): boolean;

        /**
         * Gets a service definition.
         *
         * @throws {Jymfony.Component.DependencyInjection.Exception.ServiceNotFoundException} If the service definition does not exist
         */
        getDefinition(id: ServiceIdentifier): Definition;

        /**
         * Gets a service definition by id or alias.
         * The method "unaliases" recursively to return a Definition instance.
         *
         * @throws {Jymfony.Component.DependencyInjection.Exception.ServiceNotFoundException} If the service definition does not exist
         */
        findDefinition(id: ServiceIdentifier): Definition;

        /**
         * Creates a service for a service definition.
         *
         * @throws {Jymfony.Component.DependencyInjection.Exception.RuntimeException} When the factory definition is incomplete or when the service is a synthetic service
         * @throws {Jymfony.Component.DependencyInjection.Exception.InvalidArgumentException} When configure callable is not callable
         */
        _createService(definition: Definition, id: undefined|string, tryProxy?: boolean): any;

        /**
         * Returns service ids for a given tag.
         */
        findTaggedServiceIds(name: string): Record<string, any>;

        /**
         * Returns all the defined tags.
         */
        findTags(): string[];

        /**
         * Returns a ChildDefinition that will be used for autoconfiguring the interface/class.
         */
        registerForAutoconfiguration(IF: Newable<any> | string): ChildDefinition;

        /**
         * Returns a map of ChildDefinition keyed by interface.
         */
        getAutoconfiguredInstanceof(): Record<string, ChildDefinition>;

        /**
         * @final
         */
        log(pass: CompilerPassInterface, message: string): void;

        /**
         * Returns the service conditionals.
         */
        static getServiceConditionals(value: any): any[];

        /**
         * Returns the initialized conditionals.
         *
         * @internal
         */
        static getInitializedConditionals(value: any): any[];

        /**
         * Computes a reasonably unique hash of a value.
         *
         * @param value A serializable value
         */
        static hash(value: any): string;

        /**
         * Retrieve the currently set proxy instantiator or create a new one.
         */
        private _getProxyInstantiator(): InstantiatorInterface;

        /**
         * Calls a method when creating service.
         */
        private _callMethod(service: any, call: any[]): void;

        /**
         * Gets a method call bound to a service and its arguments.
         */
        private _getFunctionCall(service: any, [ method, args ]: [ string|symbol, any[] ]): Function;

        /**
         * Shares a service in the container.
         */
        private _shareService(definition: Definition, service: any, id: string): void;

        /**
         * Replaces service references by the real service instance.
         */
        private _resolveServices(value: any): any;
    }
}
