const ExceptionInterface = Jymfony.Component.HttpFoundation.Negotiation.Exception.ExceptionInterface;

/**
 * Thrown when an invalid header is being parsed.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Negotiation.Exception
 */
class InvalidHeaderException extends mix(RuntimeException, ExceptionInterface) {
}

module.exports = InvalidHeaderException;
