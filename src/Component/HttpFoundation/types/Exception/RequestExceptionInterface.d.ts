declare namespace Jymfony.Component.HttpFoundation.Exception {
    /**
     * Interface for Request exceptions.
     * Exceptions implementing this interface should trigger an HTTP 400 response in the application code.
     */
    export class RequestExceptionInterface {
        public static readonly definition: Newable<RequestExceptionInterface>;
    }
}
