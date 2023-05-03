declare namespace Jymfony.Component.HttpFoundation.Exception {
    /**
     * The HTTP request contains headers with conflicting information.
     */
    export class ConflictingHeadersException extends mix(global.UnexpectedValueException, RequestExceptionInterface) {
    }
}
