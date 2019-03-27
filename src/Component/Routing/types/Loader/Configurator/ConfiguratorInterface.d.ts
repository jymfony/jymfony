declare namespace Jymfony.Component.Routing.Loader.Configurator {
    import RouteCollection = Jymfony.Component.Routing.RouteCollection;

    export class ConfiguratorInterface {
        /**
         * Builds a route collection from children.
         */
        build(): RouteCollection;
    }
}
