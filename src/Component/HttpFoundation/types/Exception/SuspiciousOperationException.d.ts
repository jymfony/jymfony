declare namespace Jymfony.Component.HttpFoundation.Exception {
    /**
     * Raised when a user has performed an operation that should be considered
     * suspicious from a security perspective.
     */
    export class SuspiciousOperationException extends mix(global.UnexpectedValueException, RequestExceptionInterface) {
    }
}
