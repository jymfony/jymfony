declare namespace Jymfony.Component.Routing.Annotation {
    import Route = Jymfony.Component.Routing.Annotation.Route;
    import RouteOptions = Jymfony.Component.Routing.Annotation.RouteOptions;

    /**
     * DELETE Route annotation.
     */
    export class Delete extends Route {
        __construct(options: Omit<RouteOptions, 'methods'>): void;
        constructor(options: Omit<RouteOptions, 'methods'>);
    }
}
