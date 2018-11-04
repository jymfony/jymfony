const ExceptionInterface = Jymfony.Component.Routing.Exception.ExceptionInterface;

/**
 * Exception thrown when a parameter is invalid.
 *
 * @memberOf Jymfony.Component.Routing.Exception
 */
class InvalidParameterException extends mix(InvalidArgumentException, ExceptionInterface) {
}

module.exports = InvalidParameterException;
