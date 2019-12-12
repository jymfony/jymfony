/**
 * @memberOf Jymfony.Contracts.HttpFoundation
 */
class ResponseInterface {
    /**
     * Is response invalid?
     *
     * @see http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
     *
     * @returns {boolean}
     *
     * @final
     */
    get invalid() { }

    /**
     * Is response informative?
     *
     * @returns {boolean}
     *
     * @final
     */
    get isInformational() { }

    /**
     * Is response successful?
     *
     * @returns {boolean}
     *
     * @final
     */
    get isSuccessful() { }

    /**
     * Is the response a redirect?
     *
     * @returns {boolean}
     *
     * @final
     */
    get isRedirection() { }

    /**
     * Is there a client error?
     *
     * @returns {boolean}
     *
     * @final
     */
    get isClientError() { }

    /**
     * Was there a server side error?
     *
     * @returns {boolean}
     *
     * @final
     */
    get isServerError() { }

    /**
     * Is the response OK?
     *
     * @returns {boolean}
     *
     * @final
     */
    get isOk() { }

    /**
     * Is the response forbidden?
     *
     * @returns {boolean}
     *
     * @final
     */
    get isForbidden() { }

    /**
     * Is the response a not found error?
     *
     * @returns {boolean}
     *
     * @final
     */
    get isNotFound() { }

    /**
     * Is the response a redirect of some form?
     *
     * @param {string} [location]
     *
     * @returns {boolean}
     *
     * @final
     */
    isRedirect(location = undefined) { }

    /**
     * Is the response empty?
     *
     * @returns {boolean}
     *
     * @final
     */
    get isEmpty() { }

    /**
     * Gets the response content.
     *
     * @returns {Invokable<string> | string}
     */
    get content() { }

    /**
     * Gets the response status code.
     *
     * @returns {int}
     */
    get statusCode() { }

    /**
     * Gets the response status text.
     *
     * @returns {string}
     */
    get statusText() { }

    /**
     * The response charset.
     *
     * @returns {string}
     */
    get charset() { }

    /**
     * The HTTP protocol version (1.0 or 1.1).
     *
     * @returns {string}
     *
     * @final
     */
    get protocolVersion() { }
}

export default getInterface(ResponseInterface);
