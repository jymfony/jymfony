declare namespace Jymfony.Component.Routing.Annotation {
    import Route = Jymfony.Component.Routing.Annotation.Route;
    import RouteOptions = Jymfony.Component.Routing.Annotation.RouteOptions;

    /**
     * POST Route annotation.
     */
    export class Post extends Route {
        __construct(options: Omit<RouteOptions, 'methods'>): void;
        constructor(options: Omit<RouteOptions, 'methods'>);
    }
}
