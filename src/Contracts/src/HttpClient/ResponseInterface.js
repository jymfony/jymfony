/**
 * An HTTP response.
 *
 * @memberOf Jymfony.Contracts.HttpClient
 */
class ResponseInterface {
    /**
     * Gets the HTTP status code of the response.
     *
     * @returns {Promise<int>}
     *
     * @throws {Jymfony.Contracts.HttpClient.Exception.TransportException} when a network error occurs
     */
    getStatusCode() { }

    /**
     * Gets the HTTP headers of the response.
     *
     * @param {boolean} [Throw = true] Whether an exception should be thrown on 3/4/5xx status codes
     *
     * @returns {Promise<Object.<string, string[]>>} The headers of the response keyed by header names in lowercase
     *
     * @throws {Jymfony.Contracts.HttpClient.Exception.TransportException} When a network error occurs
     * @throws {Jymfony.Contracts.HttpClient.Exception.RedirectionException} On a 3xx when Throw is true and the "max_redirects" option has been reached
     * @throws {Jymfony.Contracts.HttpClient.Exception.ClientException} On a 4xx when Throw is true
     * @throws {Jymfony.Contracts.HttpClient.Exception.ServerException} On a 5xx when Throw is true
     */
    getHeaders(Throw = true) { }

    /**
     * Gets the response body as a buffer.
     *
     * @param {boolean} [Throw = true] Whether an exception should be thrown on 3/4/5xx status codes
     *
     * @returns {Promise<Buffer>}
     *
     * @throws {Jymfony.Contracts.HttpClient.Exception.TransportException} When a network error occurs
     * @throws {Jymfony.Contracts.HttpClient.Exception.RedirectionException} On a 3xx when Throw is true and the "max_redirects" option has been reached
     * @throws {Jymfony.Contracts.HttpClient.Exception.ClientException} On a 4xx when Throw is true
     * @throws {Jymfony.Contracts.HttpClient.Exception.ServerException} On a 5xx when Throw is true
     */
    getContent(Throw = true) { }

    /**
     * Gets the response body decoded as object or array, typically from a JSON payload.
     *
     * @param {boolean} Throw Whether an exception should be thrown on 3/4/5xx status codes
     *
     * @returns {Promise<*>}
     *
     * @throws {Jymfony.Contracts.HttpClient.Exception.DecodingException} When the body cannot be decoded.
     * @throws {Jymfony.Contracts.HttpClient.Exception.TransportException} When a network error occurs
     * @throws {Jymfony.Contracts.HttpClient.Exception.RedirectionException} On a 3xx when Throw is true and the "max_redirects" option has been reached
     * @throws {Jymfony.Contracts.HttpClient.Exception.ClientException} On a 4xx when Throw is true
     * @throws {Jymfony.Contracts.HttpClient.Exception.ServerException} On a 5xx when Throw is true
     */
    getDecodedContent(Throw = true) { }

    /**
     * Closes the response stream and all related buffers.
     *
     * No further chunk will be yielded after this method has been called.
     */
    cancel() { }

    /**
     * Returns info coming from the transport layer.
     *
     * This method SHOULD NOT throw any ExceptionInterface and SHOULD be non-blocking.
     * The returned info is "live": it can be empty and can change from one call to
     * another, as the request/response progresses.
     *
     * The following info MUST be returned:
     *  - canceled (bool) - true if the response was canceled using ResponseInterface.cancel(), false otherwise
     *  - error (string|null) - the error message when the transfer was aborted, null otherwise
     *  - http_code (int) - the last response code or 0 when it is not known yet
     *  - http_method (string) - the HTTP verb of the last request
     *  - redirect_count (int) - the number of redirects followed while executing the request
     *  - redirect_url (string|null) - the resolved location of redirect responses, null otherwise
     *  - response_headers (string[]) - raw response headers array
     *  - start_time (float) - the time when the request was sent or 0.0 when it's pending
     *  - url (string) - the last effective URL of the request
     *  - user_data (mixed|null) - the value of the "user_data" request option, null if not set
     *
     * When the "capture_peer_cert_chain" option is true, the "peer_certificate_chain"
     * attribute SHOULD list the peer certificates as an array of certificate objects.
     *
     * @return {*} An object of all available info, or one of them when type is
     *             provided, or null when an unsupported type is requested
     */
    getInfo(type = null) { }
}

export default getInterface(ResponseInterface);
