/**
 * @memberOf Jymfony.Component.HttpFoundation.Exception
 */
class HttpExceptionInterface {
    /**
     * Returns the status code.
     *
     * @returns {int} An HTTP response status code
     */
    get statusCode() { }

    /**
     * Returns response headers.
     *
     * @returns {Array} Response headers
     */
    get headers() { }
}

export default getInterface(HttpExceptionInterface);
