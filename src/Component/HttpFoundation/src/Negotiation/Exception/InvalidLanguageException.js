const ExceptionInterface = Jymfony.Component.HttpFoundation.Negotiation.Exception.ExceptionInterface;

/**
 * Thrown when an invalid language is present in Accept header.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Negotiation.Exception
 */
class InvalidLanguageException extends mix(RuntimeException, ExceptionInterface) {
}

module.exports = InvalidLanguageException;
