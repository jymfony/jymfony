declare namespace Jymfony.Component.Routing.Loader.Configurator.Traits {
    import RouteConfigurator = Jymfony.Component.Routing.Loader.Configurator.RouteConfigurator;
    import Route = Jymfony.Component.Routing.Route;

    export class AddTrait {
        private _name: string;
        private _prefixes: any;

        __construct(): void;
        constructor();

        /**
         * Adds a route.
         *
         * @param name The name of the route
         * @param path the path, or the localized paths of the route
         *
         * @final
         */
        add(name: string, path: string | Record<string, string>): RouteConfigurator;

        /**
         * Adds a route.
         *
         * @param name The route name
         * @param path the path, or the localized paths of the route
         */
        __invoke(name: string, path: string | Record<string, string>): RouteConfigurator;

        /**
         * Creates a Route object.
         *
         * @param {string} path
         * @returns {Jymfony.Component.Routing.Route}
         *
         * @private
         */
        private _createRoute(path): Route;
    }
}
