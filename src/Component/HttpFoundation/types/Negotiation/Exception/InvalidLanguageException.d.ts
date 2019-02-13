declare namespace Jymfony.Component.HttpFoundation.Negotiation.Exception {
    /**
     * Thrown when an invalid language is present in Accept header.
     */
    export class InvalidLanguageException extends mix(RuntimeException, ExceptionInterface) {
    }
}
