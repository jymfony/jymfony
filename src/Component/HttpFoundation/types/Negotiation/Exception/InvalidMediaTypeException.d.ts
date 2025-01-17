declare namespace Jymfony.Component.HttpFoundation.Negotiation.Exception {
    /**
     * Thrown when an invalid media type is found into an Accept header.
     */
    export class InvalidMediaTypeException extends mix(global.RuntimeException, ExceptionInterface) {
    }
}
