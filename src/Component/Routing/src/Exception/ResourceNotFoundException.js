const ExceptionInterface = Jymfony.Component.Routing.Exception.ExceptionInterface;

/**
 * The resource was not found.
 * This exception should trigger an HTTP 404 response in your application code.
 *
 * @memberOf Jymfony.Component.Routing.Exception
 */
export default class ResourceNotFoundException extends mix(RuntimeException, ExceptionInterface) {
}
