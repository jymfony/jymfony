declare namespace Jymfony.Component.Routing.Dumper {
    import Route = Jymfony.Component.Routing.Route;
    import RouteCollection = Jymfony.Component.Routing.RouteCollection;

    /**
     * Prefix tree of routes preserving routes order.
     *
     * @internal
     */
    export class StaticPrefixCollection {
        private _prefix: string;
        private _staticPrefixes: string[];
        private _prefixes: string[];
        private _items: any[][];

        /**
         * Constructor.
         */
        __construct(prefix?: string): void;
        constructor(prefix?: string);

        /**
         * Gets the prefix
         */
        public readonly prefix: string;

        /**
         * Gets the routes.
         */
        public readonly routes: any[][];

        /**
         * Adds a route to a group.
         */
        addRoute(prefix: string, route: [string, Route] | StaticPrefixCollection): void;

        /**
         * Linearizes back a set of nested routes into a collection.
         */
        populateCollection(routes: RouteCollection): RouteCollection;

        /**
         * Gets the full and static common prefixes between two route patterns.
         *
         * The static prefix stops at last at the first opening bracket.
         */
        private _getCommonPrefix(prefix: string, anotherPrefix: string): [string, string];
    }
}
