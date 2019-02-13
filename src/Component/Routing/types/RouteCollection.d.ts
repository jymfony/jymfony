declare namespace Jymfony.Component.Routing {
    import ResourceInterface = Jymfony.Component.Config.Resource.ResourceInterface;

    /**
     * A RouteCollection represents a set of Route instances.
     *
     * When adding a route at the end of the collection, an existing route
     * with the same name is removed first. So there can only be one route
     * with a given name.
     */
    export class RouteCollection implements Iterable<[string, Route]> {
        private _routes: Record<string, Route>;
        private _resources: Record<string, ResourceInterface>;

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        /**
         * Adds a route.
         */
        add(name: string, route: Route): RouteCollection;

        /**
         * Returns all routes in this collection.
         */
        all(): Record<string, Route>;

        /**
         * Gets a route by name.
         */
        get(name: string): Route | undefined;

        /**
         * Removes a route or an array of routes from the collection.
         */
        remove(name: string | string[]): RouteCollection;

        /**
         * Adds a route collection at the end of the current set by appending all
         * routes of the added collection.
         */
        addCollection(collection: RouteCollection): RouteCollection;

        /**
         * Adds a prefix to the path of all child routes.
         *
         * @param prefix An optional prefix to add before each pattern of the route collection
         * @param [defaults = {}] A set of default values
         * @param [requirements = {}] A set of requirements
         */
        addPrefix(prefix: string, defaults?: Record<string, any>, requirements?: Record<string, string | RegExp>): RouteCollection;

        /**
         * Adds a prefix to the name of all the routes within in the collection.
         */
        addNamePrefix(prefix: string): void;

        /**
         * Sets the host pattern on all routes.
         *
         * @param {string} pattern The pattern
         * @param {Object.<string, *>} [defaults = {}] A set of default values
         * @param {Object.<string, string|RegExp>} [requirements = {}] A set of requirements
         *
         * @returns {Jymfony.Component.Routing.RouteCollection}
         */
        addHost(pattern: string, defaults?: Record<string, any>, requirements?: Record<string, string | RegExp>): RouteCollection;

        /**
         * Adds a resource for this collection.
         */
        addResource(resource: ResourceInterface): RouteCollection;

        /**
         * Sets a condition on all routes.
         * Existing conditions will be overridden.
         */
        setCondition(condition: string): void;

        /**
         * Adds defaults to all routes.
         * An existing default value under the same name in a route will be overridden.
         *
         * @param {Object.<string, *>} defaults A set of default values
         */
        addDefaults(defaults: Record<string, any>): RouteCollection;

        /**
         * Adds requirements to all routes.
         * An existing requirement under the same name in a route will be overridden.
         */
        addRequirements(requirements: Record<string, string | RegExp>): RouteCollection;

        /**
         * Adds options to all routes.
         * An existing option value under the same name in a route will be overridden.
         */
        addOptions(options: Record<string, any>): RouteCollection;

        /**
         * Sets the schemes (e.g. 'https') all child routes are restricted to.
         */
        setSchemes(schemes: string | string[]): void;

        /**
         * Sets the HTTP methods (e.g. 'POST') all child routes are restricted to.
         */
        setMethods(methods: string | string[]): void;

        /**
         * Returns the set of resources loaded to build this collection.
         */
        public readonly resources: ResourceInterface[];

        /**
         * Gets the number of routes in this collection.
         */
        public readonly length: number;

        /**
         * Gets the iterator for this collection
         */
        [Symbol.iterator](): IterableIterator<[string, Route]>;
    }
}
