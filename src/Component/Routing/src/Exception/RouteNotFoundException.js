const ExceptionInterface = Jymfony.Component.Routing.Exception.ExceptionInterface;

/**
 * Exception thrown when a route does not exist.
 *
 * @memberOf Jymfony.Component.Routing.Exception
 */
export default class RouteNotFoundException extends mix(InvalidArgumentException, ExceptionInterface) {
}
