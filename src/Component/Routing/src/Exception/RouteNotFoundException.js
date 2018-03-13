const ExceptionInterface = Jymfony.Component.Routing.Exception.ExceptionInterface;

/**
 * Exception thrown when a route does not exist.
 *
 * @memberOf Jymfony.Component.Routing.Exception
 */
class RouteNotFoundException extends mix(InvalidArgumentException, ExceptionInterface) {
}

module.exports = RouteNotFoundException;
