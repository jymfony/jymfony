declare namespace Jymfony.Component.Routing.Exception {
    /**
     * The resource was not found.
     * This exception should trigger an HTTP 404 response in your application code.
     */
    export class ResourceNotFoundException extends mix(global.RuntimeException, ExceptionInterface) {
    }
}
