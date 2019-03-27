declare namespace Jymfony.Component.Routing.Loader.Configurator {
    import JsFileLoader = Jymfony.Component.Routing.Loader.JsFileLoader;
    import RouteCollection = Jymfony.Component.Routing.RouteCollection;

    export class RoutingConfigurator extends implementationOf(ConfiguratorInterface, Traits.ConfiguratorTrait) {
        private _collection: RouteCollection;
        private _loader: JsFileLoader;
        private _path: string;
        private _file: string;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(collection: RouteCollection, loader: JsFileLoader, path: string, file: string): void;
        constructor(collection: RouteCollection, loader: JsFileLoader, path: string, file: string);

        /**
         * Imports a resource to this route collection.
         *
         * @final
         */
        import(resource: any, type?: string, ignoreErrors?: boolean): ImportConfigurator;

        /**
         * Adds a collection.
         *
         * @final
         */
        collection(name?: string): CollectionConfigurator;

        /**
         * Builds a route collection from children.
         */
        build(): RouteCollection;
    }
}
