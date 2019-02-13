declare namespace Jymfony.Component.Routing.Exception {
    /**
     * Exception thrown when a route does not exist.
     */
    export class RouteNotFoundException extends mix(InvalidArgumentException, ExceptionInterface) {
    }
}
