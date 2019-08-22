const ExceptionInterface = Jymfony.Component.HttpFoundation.Negotiation.Exception.ExceptionInterface;

/**
 * Thrown when an invalid media type is found into an Accept header.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Negotiation.Exception
 */
export default class InvalidMediaTypeException extends mix(RuntimeException, ExceptionInterface) {
}
