declare namespace Jymfony.Component.HttpFoundation {
    /**
     * RedirectResponse represents an HTTP response doing a redirect.
     */
    export class RedirectResponse extends Response {
        private _targetUrl: string;

        /**
         * Creates a redirect response so that it conforms to the rules defined for a redirect status code.
         *
         * @param url The URL to redirect to. The URL should be a full URL, with schema etc.,
         *                     but practically every browser redirects on paths only as well
         * @param [status = Jymfony.Component.HttpFoundation.Response.HTTP_FOUND] The status code (302 by default)
         * @param [headers = {}] The headers (Location is always set to the given URL)
         *
         * @throws {InvalidArgumentException}
         *
         * @see http://tools.ietf.org/html/rfc2616#section-10.3
         */
        __construct(url: string, status?: number, headers?: Record<string, string>): void;
        constructor(url: string, status?: number, headers?: Record<string, string>);

        /**
         * Factory method.
         *
         * @param url The url to redirect to
         * @param [status = Jymfony.Component.HttpFoundation.Response.HTTP_FOUND] The response status code
         * @param [headers = {}] An array of response headers
         */
        static create(url: string, status?: number, headers?: Record<string, string>): RedirectResponse;

        /**
         * Gets/sets the target URL.
         *
         * @throws {InvalidArgumentException}
         */
        public targetUrl: string;
    }
}
