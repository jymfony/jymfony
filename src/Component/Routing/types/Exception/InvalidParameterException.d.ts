declare namespace Jymfony.Component.Routing.Exception {
    /**
     * Exception thrown when a parameter is invalid.
     */
    export class InvalidParameterException extends mix(InvalidArgumentException, ExceptionInterface) {
    }
}
