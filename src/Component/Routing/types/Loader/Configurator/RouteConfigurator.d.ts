declare namespace Jymfony.Component.Routing.Loader.Configurator {
    import Route = Jymfony.Component.Routing.Route;
    import RouteCollection = Jymfony.Component.Routing.RouteCollection;

    export class RouteConfigurator extends implementationOf(
        ConfiguratorInterface,
        Traits.AddTrait, Traits.RouteTrait
    ) {
        private _collection: RouteCollection;
        private _route: RouteCollection | Route;
        private _name: string;
        private _parentConfigurator?: CollectionConfigurator;
        private _prefixes?: Record<string, string>;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(collection: RouteCollection, route: RouteCollection | Route, name?: string, parentConfigurator?: CollectionConfigurator, prefixes?: Record<string, string>): void;
        constructor(collection: RouteCollection, route: RouteCollection | Route, name?: string, parentConfigurator?: CollectionConfigurator, prefixes?: Record<string, string>);

        /**
         * Builds a route (or route collection).
         */
        // @ts-ignore
        build(): RouteCollection | Route;
    }
}
