declare namespace Jymfony.Component.Routing.Loader.Configurator.Traits {
    import Route = Jymfony.Component.Routing.Route;
    import RouteCollection = Jymfony.Component.Routing.RouteCollection;

    export class RouteTrait {
        private _route: Route | RouteCollection;

        __construct(): void;
        constructor();

        /**
         * Adds defaults.
         */
        defaults(defaults: Record<string, any>): this;

        /**
         * Adds requirements.
         */
        requirements(requirements: Record<string, string | RegExp> | string[] | RegExp[]): this;

        /**
         * Adds options.
         */
        options(options: Record<string, any>): this;

        /**
         * Sets the condition.
         */
        condition(condition: string): this;

        /**
         * Sets the pattern for the host.
         */
        host(pattern: string): this;

        /**
         * Sets the schemes (e.g. 'https') this route is restricted to.
         * So an empty array means that any scheme is allowed.
         */
        schemes(schemes: string[]): this;

        /**
         * Sets the HTTP methods (e.g. 'POST') this route is restricted to.
         * So an empty array means that any method is allowed.
         */
        methods(methods: string[]): this;

        /**
         * Adds the "_controller" entry to defaults.
         *
         * @param controller a callable or parseable pseudo-callable
         */
        controller(controller: Invokable | string): this;
    }
}
