const Response = Jymfony.Component.HttpFoundation.Response;

/**
 * RedirectResponse represents an HTTP response doing a redirect.
 *
 * @memberOf Jymfony.Component.HttpFoundation
 */
export default class RedirectResponse extends Response {
    /**
     * Creates a redirect response so that it conforms to the rules defined for a redirect status code.
     *
     * @param {string} url The URL to redirect to. The URL should be a full URL, with schema etc.,
     *                     but practically every browser redirects on paths only as well
     * @param {int} [status = Jymfony.Component.HttpFoundation.Response.HTTP_FOUND] The status code (302 by default)
     * @param {Object} [headers = {}] The headers (Location is always set to the given URL)
     *
     * @throws {InvalidArgumentException}
     *
     * @see http://tools.ietf.org/html/rfc2616#section-10.3
     */
    __construct(url, status = Response.HTTP_FOUND, headers = {}) {
        super.__construct('', ~~status, headers);
        this.targetUrl = url;

        if (! this.isRedirect()) {
            throw new InvalidArgumentException(__jymfony.sprintf('The HTTP status code is not a redirect ("%s" given).', status));
        }

        if (Response.HTTP_MOVED_PERMANENTLY === this.statusCode && ! headers.hasOwnProperty('cache-control')) {
            this.headers.remove('cache-control');
        }
    }

    /**
     * Factory method for chainability.
     *
     * @param {string} url The url to redirect to
     * @param {int} [status = Jymfony.Component.HttpFoundation.Response.HTTP_FOUND] The response status code
     * @param {Object} [headers = {}] An array of response headers
     *
     * @return {Jymfony.Component.HttpFoundation.RedirectResponse}
     */
    static create(url, status = Response.HTTP_FOUND, headers = {}) {
        return new __self(url, status, headers);
    }

    /**
     * Returns the target URL.
     *
     * @returns {string} target URL
     */
    get targetUrl() {
        return this._targetUrl;
    }

    /**
     * Sets the redirect target of this response.
     *
     * @param {string} url The URL to redirect to
     *
     * @throws {InvalidArgumentException}
     */
    set targetUrl(url) {
        if (! url) {
            throw new InvalidArgumentException('Cannot redirect to an empty URL.');
        }

        this._targetUrl = url;
        this.content = __jymfony.sprintf(`<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="refresh" content="0;url=%1$s" />

        <title>Redirecting to %1$s</title>
    </head>
    <body>
        Redirecting to <a href="%1$s">%1$s</a>.
    </body>
</html>`, encodeURI(url));

        this.headers.set('Location', url);
    }
}
