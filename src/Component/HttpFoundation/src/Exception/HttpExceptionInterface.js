/**
 * @memberOf Jymfony.Component.HttpFoundation.Exception
 */
class HttpExceptionInterface {
    /**
     * Returns the status code.
     *
     * @return int An HTTP response status code
     */
    get statusCode() { }

    /**
     * Returns response headers.
     *
     * @return array Response headers
     */
    get headers() { }
}

module.exports = getInterface(HttpExceptionInterface);
