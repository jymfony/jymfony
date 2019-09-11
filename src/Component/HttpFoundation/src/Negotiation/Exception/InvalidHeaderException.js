const ExceptionInterface = Jymfony.Component.HttpFoundation.Negotiation.Exception.ExceptionInterface;

/**
 * Thrown when an invalid header is being parsed.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Negotiation.Exception
 */
export default class InvalidHeaderException extends mix(RuntimeException, ExceptionInterface) {
}
