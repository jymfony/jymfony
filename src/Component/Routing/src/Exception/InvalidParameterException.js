const ExceptionInterface = Jymfony.Component.Routing.Exception.ExceptionInterface;

/**
 * Exception thrown when a parameter is invalid.
 *
 * @memberOf Jymfony.Component.Routing.Exception
 */
export default class InvalidParameterException extends mix(InvalidArgumentException, ExceptionInterface) {
}
