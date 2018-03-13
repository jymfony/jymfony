const ExceptionInterface = Jymfony.Component.Routing.Exception.ExceptionInterface;

/**
 * The resource was found but the request method is not allowed.
 * This exception should trigger an HTTP 405 response in your application code.
 *
 * @memberOf Jymfony.Component.Routing.Exception
 */
class MethodNotAllowedException extends mix(RuntimeException, ExceptionInterface) {
    /**
     * Constructor.
     *
     * @param {[string]} allowedMethods
     * @param {string} message
     * @param {int} code
     * @param {Exception} previous
     */
    __construct(allowedMethods, message = undefined, code = 0, previous = null) {
        this._allowedMethods = allowedMethods.map(m => m.toUpperCase());

        super.__construct(message, code, previous);
    }

    /**
     * Gets the allowed HTTP methods.
     *
     * @return {[string]}
     */
    get allowedMethods() {
        return [ ...this._allowedMethods ];
    }
}

module.exports = MethodNotAllowedException;
