declare namespace Jymfony.Component.DependencyInjection {
    export class Definition {
        private _class: string | undefined;
        private _arguments: any[];
        private _module: string[] | undefined;
        private _factory: string | string[] | undefined;
        private _shared: boolean;
        private _deprecated: boolean;
        private _deprecationTemplate: string;
        private _properties: Record<string | symbol, any>;
        private _calls: [string, any[]];
        private _configurator: string | string[] | Invokable | undefined;
        private _tags: Record<string, string>;
        private _public: boolean;
        private _synthetic: boolean;
        private _abstract: boolean;
        private _lazy: boolean;
        private _decoratedService: any;
        private _shutdown: [string, any[]];
        private _changes: any;

        /**
         * Constructor.
         */
        __construct(class_?: any, args?: any[]): void;
        constructor(class_?: any, args?: any[]);

        /**
         * Sets the changes.
         */
        setChanges(changes: any): this;

        /**
         * Returns all changes tracked for the Definition object.
         */
        getChanges(): any;

        /**
         * Sets the service factory.
         */
        setFactory(factory: string | string[] | undefined): this;

        /**
         * Gets the current factory.
         */
        getFactory(): string | string[] | undefined;

        /**
         * Sets the service that this service is decorating.
         */
        setDecoratedService(id: string, renamedId?: string, priority?: number): this;

        /**
         * Gets the decorated service definition (id, inner id, priority).
         */
        getDecoratedService(): [string, string, number] | undefined;

        /**
         * Sets the service class.
         */
        setClass(className: string | Function): this;

        /**
         * Gets service class name.
         */
        getClass(): string;

        /**
         * Sets the arguments to pass to the service constructor/factory.
         */
        setArguments(args: any[]): this;

        /**
         * Adds an argument to the list.
         */
        addArgument(argument: any): this;

        /**
         * Replaces an argument.
         */
        replaceArgument(index: number, argument: any): this;

        /**
         * Gets the argument list.
         */
        getArguments(): any[];

        /**
         * Gets a single argument.
         */
        getArgument(index: number): any;

        /**
         * Defines properties to set at service creation.
         */
        setProperties(properties: Record<string, any>): this;

        /**
         * Sets a property to set to the service.
         */
        addProperty(property: string, value: any): this;

        /**
         * Gets the properties to set on the service.
         */
        getProperties(): Record<string, any>;

        /**
         * Sets the methods to call after service construction.
         */
        setMethodCalls(calls?: [string, any[]]): this;

        /**
         * Adds a method to call.
         */
        addMethodCall(method: string, args?: any[]): this;

        /**
         * Removes a method to call after service initialization.
         */
        removeMethodCall(method: string): this;

        /**
         * Checks if the definition has a given method call.
         */
        hasMethodCall(method: string): boolean;

        /**
         * Gets the methods to call.
         */
        getMethodCalls(): [string, any[]][];

        /**
         * Sets the service tags.
         */
        setTags(tags: Record<string, any[]>);

        /**
         * Gets all tags.
         */
        getTags(): Record<string, any[]>;

        /**
         * Gets a tag by name.
         */
        getTag(name: string): any[];

        /**
         * Adds a tag.
         */
        addTag(name: string, attributes: any): this;

        /**
         * Checks if a tag is present.
         */
        hasTag(name: string): boolean;

        /**
         * Clears all the tags for a given name.
         */
        clearTag(name: string): this;

        /**
         * Clears all the tags.
         */
        clearTags(): this;

        /**
         * Use a module require as a factory for this service (with optional property).
         * The "new" operator is used only if a property is defined, otherwise
         * the result of the require call is used as service.
         *
         * @param module The module to be required.
         * @param [property] The property to be used as service in module.
         */
        setModule(module: string, property?: string): this;

        /**
         * Gets the module to be used as service.
         */
        getModule(): string[];

        /**
         * Sets if this service must be shared.
         */
        setShared(shared: boolean): this;

        /**
         * Checks if this service is shared.
         */
        isShared(): boolean;

        /**
         * Sets if this service is public (can be retrieved by Container#get).
         */
        setPublic(_public: boolean): this;

        /**
         * Checks if this service should be public.
         */
        isPublic(): boolean;

        /**
         * Sets the lazy flag for this service.
         */
        setLazy(lazy: boolean): this;

        /**
         * Is this service lazy?
         */
        isLazy(): boolean;

        /**
         * Sets if this is a synthetic service (cannot be constructed,
         * but must be injected).
         */
        setSynthetic(synthetic: boolean): this;

        /**
         * Checks if this service is synthetic.
         */
        isSynthetic(): boolean;

        /**
         * Sets the abstract flag for this service
         * Abstract services serves as templates for other ones.
         */
        setAbstract(abstract: boolean): this;

        /**
         * Checks if this is an abstract service.
         */
        isAbstract(): boolean;

        /**
         * Set the deprecated flag and message for this service
         * If marked as deprecated, a deprecation warning will be triggered
         * during its initialization. The deprecation message is defined by
         * the template parameter and could contain '%service_id%' that will
         * be replaced by the real service id.
         */
        setDeprecated(status?: boolean, template?: string): this;

        /**
         * Checks whether this service is deprecated.
         */
        isDeprecated(): boolean;

        /**
         * Build the deprecation message for a given service id.
         */
        getDeprecationMessage(id: string): string;

        /**
         * Sets a configurator to be called after the service is initialized.
         */
        setConfigurator(configurator: string | string[] | Invokable | undefined): this;

        /**
         * Gets the configurator for this service.
         */
        getConfigurator(): string | string[] | Invokable | undefined;

        /**
         * Sets the methods to call at container shutdown.
         */
        setShutdownCalls(calls?: [string, any[]]): this;

        /**
         * Adds a method to call at shutdown.
         */
        addShutdownCall(method: string, args: any[]): this;

        /**
         * Removes a method to call at container shutdown.
         */
        removeShutdownCall(method: string): this;

        /**
         * Checks if the definition has a given shutdown method call.
         */
        hasShutdownCall(method: string): boolean;

        /**
         * Gets the methods to call at shutdown.
         */
        getShutdownCalls(): [string, any[]][];
    }
}
