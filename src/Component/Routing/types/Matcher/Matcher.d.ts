declare namespace Jymfony.Component.Routing.Matcher {
    import Request = Jymfony.Component.HttpFoundation.Request;
    import Route = Jymfony.Component.Routing.Route;
    import RouteCollection = Jymfony.Component.Routing.RouteCollection;

    /**
     * Matches request based on a set of routes.
     */
    export class Matcher extends implementationOf(MatcherInterface) {
        private _routes: RouteCollection;
        /**
         * Constructor.
         */
        __construct(routes: RouteCollection): void;
        constructor(routes: RouteCollection);

        /**
         * @inheritdoc
         */
        matchRequest(request: Request): Record<string, any>;

        /**
         * Redirects the user to another URL.
         */
        redirect(request: Request, path: string, route: string, scheme?: string | null): Record<string, any>;

        /**
         * Returns a set of values to use as request attributes.
         */
        protected _getAttributes(route: Route, name: string, attributes: Record<string, string>): Record<string, any>;
    }
}
