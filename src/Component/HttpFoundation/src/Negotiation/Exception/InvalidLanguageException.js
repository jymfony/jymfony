const ExceptionInterface = Jymfony.Component.HttpFoundation.Negotiation.Exception.ExceptionInterface;

/**
 * Thrown when an invalid language is present in Accept header.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Negotiation.Exception
 */
export default class InvalidLanguageException extends mix(RuntimeException, ExceptionInterface) {
}
