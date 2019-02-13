declare namespace Jymfony.Component.Routing.Loader.Configurator {
    import Route = Jymfony.Component.Routing.Route;
    import RouteCollection = Jymfony.Component.Routing.RouteCollection;

    export class CollectionConfigurator extends implementationOf(
        ConfiguratorInterface, Traits.ConfiguratorTrait,
        Traits.AddTrait, Traits.RouteTrait
    ) {
        private _parent: RouteCollection;
        private _name: string;
        private _collection: RouteCollection;
        private _route: Route;
        private _parentPrefixes: Record<string, string>;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(parent: RouteCollection, name: string, parentPrefixes?: Record<string, string>): void;
        constructor(parent: RouteCollection, name: string, parentPrefixes?: Record<string, string>);

        /**
         * @inheritdoc
         */
        build(): RouteCollection;

        /**
         * Creates a sub-collection.
         */
        collection(name?: CollectionConfigurator): CollectionConfigurator;

        /**
         * Sets the prefix to add to the path of all child routes.
         *
         * @param prefix the prefix, or the localized prefixes
         */
        prefix(prefix: string | Record<string, string>): this;

        /**
         * Creates a route from path.
         */
        private _createRoute(path: string): Route;
    }
}
