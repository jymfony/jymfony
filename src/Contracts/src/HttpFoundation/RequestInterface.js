/**
 * @memberOf Jymfony.Contracts.HttpFoundation
 */
class RequestInterface {
    /**
     * Whether the request is secure or not.
     *
     * This method can read the client protocol from the "X-Forwarded-Proto" header
     * when trusted proxies were set via "setTrustedProxies()".
     *
     * The "X-Forwarded-Proto" header must contain the protocol: "https" or "http" or "wss".
     *
     * @returns {boolean}
     */
    get isSecure() { }

    /**
     * The request's scheme.
     *
     * @returns {string}
     */
    get scheme() { }

    /**
     * The client IP address.
     *
     * This method can read the client IP address from the "X-Forwarded-For" header
     * when trusted proxies were set via "setTrustedProxies()". The "X-Forwarded-For"
     * header value is a comma+space separated list of IP addresses, the left-most
     * being the original client, and each successive proxy that passed the request
     * adding the IP address where it received the request from.
     *
     * @returns {string} The client IP address
     *
     * @see _getClientIps()
     * @see http://en.wikipedia.org/wiki/X-Forwarded-For
     */
    get clientIp() { }

    /**
     * The path being requested.
     * The path info always starts with a /.
     *
     * Suppose this request is instantiated from /mysite on localhost:
     *
     *  * http://localhost              returns an empty string
     *  * http://localhost/about        returns '/about'
     *  * http://localhost/enco%20ded   returns '/enco%20ded'
     *  * http://localhost/about?var=1  returns '/about'
     *
     * @returns {string} The raw path (i.e. not urldecoded)
     */
    get pathInfo() { }

    /**
     * The host name.
     *
     * This method can read the client host name from the "X-Forwarded-Host" header
     * when trusted proxies were set via "setTrustedProxies()".
     *
     * The "X-Forwarded-Host" header must contain the client host name.
     *
     * @returns {string}
     *
     * @throws SuspiciousOperationException when the host name is invalid or not trusted
     */
    get host() { }

    /**
     * The HTTP host being requested.
     *
     * The port name will be appended to the host if it's non-standard.
     *
     * @returns {string}
     */
    get httpHost() { }

    /**
     * The scheme and HTTP host.
     *
     * If the URL was called with basic authentication, the user
     * and the password are not added to the generated string.
     *
     * @returns {string} The scheme and HTTP host
     */
    get schemeAndHttpHost() { }

    /**
     * The full URI for this request.
     *
     * @returns {string}
     */
    get uri() { }

    /**
     * The port on which the request is made.
     *
     * This method can read the client port from the "X-Forwarded-Port" header
     * when trusted proxies were set via "setTrustedProxies()".
     *
     * The "X-Forwarded-Port" header must contain the client port.
     *
     * @returns {int}
     */
    get port() { }

    /**
     * The request "intended" method.
     *
     * If the X-HTTP-Method-Override header is set, and if the method is a POST,
     * then it is used to determine the "real" intended HTTP method.
     *
     * The _method request parameter can also be used to determine the HTTP method,
     * but only if enableHttpMethodParameterOverride() has been called.
     *
     * The method is always an uppercased string.
     *
     * @returns {string}
     */
    get method() { }

    /**
     * Checks if the request method is of specified type.
     *
     * @param method Uppercase request method (GET, POST etc)
     *
     * @returns {boolean}
     */
    isMethod(method) { }

    /**
     * Checks whether or not the method is safe.
     *
     * @see https://tools.ietf.org/html/rfc7231#section-4.2.1
     *
     * @returns {boolean}
     */
    get isMethodSafe() { }

    /**
     * Returns true if the request is a XMLHttpRequest.
     *
     * It works if your JavaScript library sets an X-Requested-With HTTP header.
     * It is known to work with common JavaScript frameworks:
     *
     * @see http://en.wikipedia.org/wiki/List_of_Ajax_frameworks#JavaScript
     *
     * @returns {boolean} true if the request is an XMLHttpRequest, false otherwise
     */
    get isXmlHttpRequest() { }

    /**
     * Returns the protocol version.
     *
     * If the application is behind a proxy, the protocol version used in the
     * requests between the client and the proxy and between the proxy and the
     * server might be different. This returns the former (from the "Via" header)
     * if the proxy is trusted (see "setTrustedProxies()"), otherwise it returns
     * the latter (from the "SERVER_PROTOCOL" server parameter).
     *
     * @returns {string}
     */
    get protocolVersion() { }

    /**
     * Gets the request format.
     *
     * Here is the process to determine the format:
     *
     *  * format defined by the user (with setRequestFormat())
     *  * _format request attribute
     *  * defaultFormat
     *
     * @param {string} [defaultFormat = 'html'] The default format
     *
     * @returns {string} The request format
     */
    getRequestFormat(defaultFormat) { }

    /**
     * Indicates whether this request originated from a trusted proxy.
     *
     * This can be useful to determine whether or not to trust the
     * contents of a proxy-specific header.
     *
     * @returns {boolean} true if the request came from a trusted proxy, false otherwise
     */
    get isFromTrustedProxy() { }
}

export default getInterface(RequestInterface);
