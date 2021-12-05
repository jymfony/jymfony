/**
 * Provides flexible methods for requesting HTTP resources asynchronously.
 *
 * @memberOf Jymfony.Contracts.HttpClient
 */
class HttpClientInterface {
    /**
     * Requests an HTTP resource.
     *
     * Responses MUST be lazy, but their status code MUST be
     * checked even if none of their public methods are called.
     *
     * Implementations are not required to support all options described above; they can also
     * support more custom options; but in any case, they MUST throw a TransportExceptionInterface
     * when an unsupported option is passed.
     *
     * @param {string} method
     * @param {string} url
     * @param {Object.<string, *>} options
     *
     * @returns {Jymfony.Contracts.HttpClient.ResponseInterface}
     *
     * @throws {Jymfony.Contracts.HttpClient.Exception.TransportException} When an unsupported option is passed
     */
    request(method, url, options = {}) { }
}

Object.defineProperty(HttpClientInterface, 'OPTIONS_DEFAULTS', {
    value: {
        auth_basic: null,       // [string, string]|string - an array containing the username as first value, and optionally the
                                //   password as the second one; or string like username:password - enabling HTTP Basic
                                //   authentication (RFC 7617)
        auth_bearer: null,      // string - a token enabling HTTP Bearer authorization (RFC 6750)
        query: {},              // Object.<string, string> - associative array of query string values to merge with the request's URL
        headers: {},            // Object.<string, string|string[]> - headers names provided as keys or as part of values
        body: '',               // Object.<string, string>|string|ReadableStream|Buffer - the callback SHOULD yield a string
                                //   smaller than the amount requested as argument; the empty string signals EOF; if
                                //   an object is passed, it is meant as a form payload of field names and values
        json: null,             // mixed - if set, implementations MUST set the "body" option to the JSON-encoded
                                //   value and set the "content-type" header to a JSON-compatible value if it is not
                                //   explicitly defined in the headers option - typically "application/json"
        user_data: undefined,   // mixed - any extra data to attach to the request (scalar, callable, object...) that
                                //   MUST be available via $response->getInfo('user_data') - not used internally
        max_redirects: 20,      // int - the maximum number of redirects to follow; a value lower than or equal to 0
                                //   means redirects should not be followed; "Authorization" and "Cookie" headers MUST
                                //   NOT follow except for the initial host name
        http_version: null,     // string - defaults to the best supported version, typically 1.1 or 2.0
        base_uri: null,         // string - the URI to resolve relative URLs, following rules in RFC 3986, section 2
        buffer: true,           // boolean|WritableStream|Function - whether the content of the response should be buffered or not,
                                //   or a Buffer where the response body should be written,
                                //   or a closure telling if/where the response should be buffered based on its headers
        on_progress: null,      // function(dlNow: number, dlSize: int, info: any) - throwing any exceptions MUST abort
                                //   the request; it MUST be called on DNS resolution, on arrival of headers and on
                                //   completion; it SHOULD be called on upload/download of data and at least 1/s
        resolve: [],            // Object.<string, string> - a map of host to IP address that SHOULD replace DNS resolution
        proxy: null,            // string - by default, the proxy-related env vars handled by curl SHOULD be honored
        no_proxy: null,         // string - a comma separated list of hosts that do not require a proxy to be reached
        timeout: null,          // float - the idle timeout - defaults to 60
        max_duration: 0,        // float - the maximum execution time for the request+response as a whole;
                                //   a value lower than or equal to 0 means it is unlimited
        bind_to: '0',           // string - the interface or the local socket to bind to
        verify_peer: true,      // boolean - require verification of SSL certificate used.
        verify_host: true,      // boolean - check the existence of a common name and also verify that it matches the hostname provided
        resolvers: null,        // string[] - DNS resolver servers. Use system default if null or not passed.
        capture_peer_cert_chain: false,
        ca_file: null,
        local_cert: null,
        local_pk: null,
        passphrase: null,
        ciphers: null,
    }
});

export default getInterface(HttpClientInterface);
