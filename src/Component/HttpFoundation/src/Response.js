const DateTime = Jymfony.Component.DateTime.DateTime;
const DateTimeZone = Jymfony.Component.DateTime.DateTimeZone;
const Request = Jymfony.Component.HttpFoundation.Request;
const ResponseHeaderBag = Jymfony.Component.HttpFoundation.ResponseHeaderBag;

/**
 * @memberOf Jymfony.Component.HttpFoundation
 */
class Response {
    /**
     * Constructor.
     *
     * @param {string} [content = '']
     * @param {int} [status = Jymfony.Component.HttpFoundation.Response.HTTP_OK]
     * @param {Object} [headers = {}]
     */
    __construct(content = '', status = __self.HTTP_OK, headers = {}) {
        /**
         * @type {Jymfony.Component.HttpFoundation.ResponseHeaderBag}
         */
        this.headers = new ResponseHeaderBag(headers);

        this.content = content;
        this.setStatusCode(status);
        this.protocolVersion = '1.0';

        /**
         * @type {undefined|string}
         *
         * @protected
         */
        this._charset = undefined;
    }

    /**
     * Is response invalid?
     *
     * @returns {boolean}
     *
     * @see http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
     *
     * @final
     */
    get invalid() {
        return 100 > this._statusCode || 600 <= this._statusCode;
    }

    /**
     * Is response informative?
     *
     * @returns {boolean}
     *
     * @final
     */
    get isInformational() {
        return 100 <= this._statusCode && 200 > this._statusCode;
    }

    /**
     * Is response successful?
     *
     * @returns {boolean}
     *
     * @final
     */
    get isSuccessful() {
        return 200 <= this._statusCode && 300 > this._statusCode;
    }

    /**
     * Is the response a redirect?
     *
     * @returns {boolean}
     *
     * @final
     */
    get isRedirection() {
        return 300 <= this._statusCode && 400 > this._statusCode;
    }

    /**
     * Is there a client error?
     *
     * @returns {boolean}
     *
     * @final
     */
    get isClientError() {
        return 400 <= this._statusCode && 500 > this._statusCode;
    }

    /**
     * Was there a server side error?
     *
     * @returns {boolean}
     *
     * @final
     */
    get isServerError() {
        return 500 <= this._statusCode && 600 > this._statusCode;
    }

    /**
     * Is the response OK?
     *
     * @returns {boolean}
     *
     * @final
     */
    get isOk() {
        return 200 === this._statusCode;
    }

    /**
     * Is the response forbidden?
     *
     * @returns {boolean}
     *
     * @final
     */
    get isForbidden() {
        return 403 === this._statusCode;
    }

    /**
     * Is the response a not found error?
     *
     * @returns {boolean}
     *
     * @final
     */
    get isNotFound() {
        return 404 === this._statusCode;
    }

    /**
     * Is the response a redirect of some form?
     *
     * @param {undefined|string} [location]
     *
     * @returns {boolean}
     *
     * @final
     */
    isRedirect(location = undefined) {
        return -1 < [ 201, 301, 302, 303, 307, 308 ].indexOf(this._statusCode) &&
            (undefined === location ? true : location === this._headers.get('Location'));
    }

    /**
     * Is the response empty?
     *
     * @returns {boolean}
     *
     * @final
     */
    get isEmpty() {
        return 204 === this._statusCode || 304 === this._statusCode;
    }


    /**
     * Sets the response content.
     *
     * @param {*} content
     */
    set content(content) {
        if (isFunction(content)) {
            this._content = content;
        } else {
            this._content = content.toString();
        }
    }

    /**
     * Gets the response content.
     *
     * @returns {Function|string}
     */
    get content() {
        return this._content;
    }

    /**
     * Gets the response status code.
     *
     * @returns {int}
     */
    get statusCode() {
        return this._statusCode;
    }

    /**
     * Gets the response status text.
     *
     * @returns {string}
     */
    get statusText() {
        return this._statusText;
    }

    /**
     * Sets the response status code and text.
     *
     * @param {int} code
     * @param {string} [text]
     */
    setStatusCode(code, text = undefined) {
        this._statusCode = code;
        if (this.invalid) {
            throw new InvalidArgumentException('The HTTP status code "' + code + '" is not valid.');
        }

        if (undefined === text) {
            this._statusText = __self.statusTexts[code] || 'unknown status';
            return;
        }

        /**
         * @type {string}
         *
         * @private
         */
        this._statusText = text;
    }

    /**
     * Marks the response as "private".
     *
     * It makes the response ineligible for serving other clients.
     *
     * @returns {Jymfony.Component.HttpFoundation.Response}
     *
     * @final
     */
    setPrivate() {
        this.headers.removeCacheControlDirective('public');
        this.headers.addCacheControlDirective('private');

        return this;
    }

    /**
     * Marks the response as "public".
     *
     * It makes the response eligible for serving other clients.
     *
     * @returns {Jymfony.Component.HttpFoundation.Response}
     *
     * @final
     */
    setPublic() {
        this.headers.addCacheControlDirective('public');
        this.headers.removeCacheControlDirective('private');

        return this;
    }

    /**
     * Marks the response as "immutable".
     *
     * @returns {Jymfony.Component.HttpFoundation.Response}
     *
     * @final
     */
    setImmutable(immutable = true) {
        if (immutable) {
            this.headers.addCacheControlDirective('immutable');
        } else {
            this.headers.removeCacheControlDirective('immutable');
        }

        return this;
    }

    /**
     * Returns true if the response is marked as "immutable".
     *
     * @returns {boolean}
     *
     * @final
     */
    get immutable() {
        return this.headers.hasCacheControlDirective('immutable');
    }


    /**
     * Returns true if the response must be revalidated by caches.
     *
     * This method indicates that the response must not be served stale by a
     * cache in any circumstance without first revalidating with the origin.
     * When present, the TTL of the response should not be overridden to be
     * greater than the value provided by the origin.
     *
     * @returns {boolean}
     *
     * @final
     */
    get mustRevalidate() {
        return this.headers.hasCacheControlDirective('must-revalidate') || this.headers.hasCacheControlDirective('proxy-revalidate');
    }

    /**
     * Returns the Date header as a DateTime instance.
     *
     * @returns {Jymfony.Component.DateTime.DateTime}
     *
     * @throws {RuntimeException} When the header is not parseable
     *
     * @final
     */
    get date() {
        return this.headers.getDate('Date');
    }

    /**
     * Sets the Date header.
     *
     * @param {Jymfony.Component.DateTime.DateTime} date
     *
     * @returns {Jymfony.Component.HttpFoundation.Response}
     *
     * @final
     */
    setDate(date) {
        if (date instanceof DateTime) {
            date = date.timestamp;
        }

        date = new DateTime(date, new DateTimeZone('UTC'));
        this.headers.set('Date', date.format('D, d M Y H:i:s') + ' GMT');

        return this;
    }

    /**
     * Returns the age of the response in seconds.
     *
     * @returns {int}
     *
     * @final
     */
    get age() {
        const age = this.headers.get('Age');
        if (age) {
            return ~~age;
        }

        return Math.max(DateTime.unixTime - this.date.timestamp, 0);
    }

    /**
     * Marks the response stale by setting the Age header to be equal to the maximum age of the response.
     *
     * @returns {Jymfony.Component.HttpFoundation.Response}
     */
    expire() {
        if (this.isFresh) {
            this.headers.set('Age', this.maxAge);
            this.headers.remove('Expires');
        }

        return this;
    }

    /**
     * Returns the value of the Expires header as a DateTime instance.
     *
     * @returns {undefined|Jymfony.Component.DateTime.DateTime}
     *
     * @final
     */
    get expires() {
        try {
            return this.headers.getDate('Expires');
        } catch (e) {
            // According to RFC 2616 invalid date formats (e.g. "0" and "-1") must be treated as in the past
            return new DateTime(DateTime.unixTime - 172800);
        }
    }

    /**
     * Sets the Expires HTTP header with a DateTime instance.
     *
     * Passing null as value will remove the header.
     *
     * @param {int|Jymfony.Component.DateTime.DateTime} [date]
     *
     * @returns {Jymfony.Component.HttpFoundation.Response}
     *
     * @final
     */
    setExpires(date = undefined) {
        if (! date) {
            this.headers.remove('Expires');

            return this;
        }

        if (date instanceof DateTime) {
            date = date.timestamp;
        }

        date = new DateTime(date, new DateTimeZone('UTC'));
        this.headers.set('Expires', date.format('D, d M Y H:i:s') + ' GMT');

        return this;
    }

    /**
     * Returns the number of seconds after the time specified in the response's Date
     * header when the response should no longer be considered fresh.
     *
     * First, it checks for a s-maxage directive, then a max-age directive, and then it falls
     * back on an expires header. It returns undefined when no maximum age can be established.
     *
     * @returns {undefined|int}
     *
     * @final
     */
    get maxAge() {
        if (this.headers.hasCacheControlDirective('s-maxage')) {
            return ~~(this.headers.getCacheControlDirective('s-maxage'));
        }

        if (this.headers.hasCacheControlDirective('max-age')) {
            return ~~(this.headers.getCacheControlDirective('max-age'));
        }

        if (this.expires) {
            return this.expires.timestamp - this.date.timestamp;
        }

        return undefined;
    }

    /**
     * Sets the number of seconds after which the response should no longer be considered fresh.
     *
     * This methods sets the Cache-Control max-age directive.
     *
     * @param {int} value
     *
     * @returns {Jymfony.Component.HttpFoundation.Response}
     *
     * @final
     */
    setMaxAge(value) {
        this.headers.addCacheControlDirective('max-age', value);

        return this;
    }

    /**
     * Sets the number of seconds after which the response should no longer be considered fresh by shared caches.
     *
     * This methods sets the Cache-Control s-maxage directive.
     *
     * @param {int} value
     *
     * @returns {Jymfony.Component.HttpFoundation.Response}
     *
     * @final
     */
    setSharedMaxAge(value) {
        this.setPublic();
        this.headers.addCacheControlDirective('s-maxage', value);

        return this;
    }

    /**
     * Returns the response's time-to-live in seconds.
     *
     * It returns undefined when no freshness information is present in the response.
     *
     * When the responses TTL is <= 0, the response may not be served from cache without first
     * revalidating with the origin.
     *
     * @returns {undefined|int}
     *
     * @final
     */
    get ttl() {
        const maxAge = this.maxAge;

        return undefined !== maxAge ? maxAge - this.age : undefined;
    }

    /**
     * Sets the response's time-to-live for shared caches in seconds.
     *
     * This method adjusts the Cache-Control/s-maxage directive.
     *
     * @param {int} seconds
     *
     * @returns {Jymfony.Component.HttpFoundation.Response}
     *
     * @final
     */
    setTtl(seconds) {
        this.setSharedMaxAge(this.age + seconds);

        return this;
    }

    /**
     * Sets the response's time-to-live for private/client caches in seconds.
     *
     * This method adjusts the Cache-Control/max-age directive.
     *
     * @param {int} seconds
     *
     * @returns {Jymfony.Component.HttpFoundation.Response}
     *
     * @final
     */
    setClientTtl(seconds) {
        this.setMaxAge(this.age + seconds);

        return this;
    }

    /**
     * Returns the Last-Modified HTTP header as a DateTime instance.
     *
     * @returns {Jymfony.Component.DateTime.DateTime}
     *
     * @throws {RuntimeException} When the HTTP header is not parseable
     *
     * @final
     */
    get lastModified() {
        return this.headers.getDate('Last-Modified');
    }

    /**
     * Sets the Last-Modified HTTP header with a DateTime instance.
     *
     * Passing undefined as value will remove the header.
     *
     * @final
     */
    set lastModified(date) {
        if (undefined === date) {
            this.headers.remove('Last-Modified');

            return;
        }

        date = new DateTime(date instanceof DateTime ? date.timestamp : date, DateTimeZone.get('UTC'));
        this.headers.set('Last-Modified', date.format('D, d M Y H:i:s') + ' GMT');
    }

    /**
     * Returns the literal value of the ETag HTTP header.
     *
     * @returns {string}
     *
     * @final
     */
    get etag() {
        return this.headers.get('ETag');
    }

    /**
     * Sets the ETag value.
     *
     * @param {string|undefined} etag The ETag unique identifier or null to remove the header
     * @param {boolean} weak Whether you want a weak ETag or not
     *
     * @final
     */
    setEtag(etag = undefined, weak = false) {
        if (undefined === etag) {
            this.headers.remove('Etag');
        } else {
            if (0 !== etag.indexOf('"')) {
                etag = '"' + etag + '"';
            }

            this.headers.set('ETag', (true === weak ? 'W/' : '') + etag);
        }

        return this;
    }

    /**
     * Returns true if the response includes a Vary header.
     *
     * @returns {boolean}
     *
     * @final
     */
    hasVary() {
        return this.headers.has('Vary');
    }

    /**
     * Returns an array of header names given in the Vary header.
     *
     * @returns {string[]}
     *
     * @final
     */
    get vary() {
        if (! this.hasVary()) {
            return [];
        }

        const vary = this.headers.get('Vary');

        let ret = [];
        for (const item of vary) {
            ret = ret.concat(item.split(', '));
        }

        return ret;
    }

    /**
     * Sets the Vary header.
     *
     * @param {string|string[]} headers
     * @param {boolean} [replace = true] Whether to replace the actual value or not (true by default)
     *
     * @final
     */
    setVary(headers, replace = true) {
        this.headers.set('Vary', headers, replace);

        return this;
    }

    /**
     * Retrieves the response charset.
     *
     * @returns {string}
     */
    get charset() {
        return this._charset;
    }

    /**
     * Sets the response charset.
     *
     * @param {string} charset
     */
    set charset(charset) {
        this._charset = charset;
    }

    /**
     * Sets the HTTP protocol version (1.0 or 1.1).
     *
     * @param {string} version
     *
     * @final
     */
    set protocolVersion(version) {
        this._version = version;
    }

    /**
     * Gets the HTTP protocol version.
     *
     * @final
     */
    get protocolVersion() {
        return this._version;
    }

    /**
     * Prepares the Response before it is sent to the client.
     *
     * This method tweaks the Response to ensure that it is
     * compliant with RFC 2616. Most of the changes are based on
     * the Request that is "associated" with this Response.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     *
     * @returns {Jymfony.Component.HttpFoundation.Response}
     */
    prepare(request) {
        if (this.isInformational || this.isEmpty) {
            this.content = '';
            this.headers.remove('Content-Type');
            this.headers.remove('Content-Length');
        } else {
            // Content-type based on the Request
            if (! this.headers.has('Content-Type')) {
                const format = request.getRequestFormat();
                const mimeType = Request.getMimeType(format);
                if (format && mimeType) {
                    this.headers.set('Content-Type', mimeType);
                }
            }

            // Fix Content-Type
            const charset = this.charset || 'UTF-8';
            const contentType = this.headers.get('Content-Type', '');
            if (! this.headers.has('Content-Type')) {
                this.headers.set('Content-Type', 'text/html; charset='+charset);
            } else if (0 === contentType.indexOf('text/') && -1 === contentType.indexOf('charset')) {
                // Add the charset
                this.headers.set('Content-Type', contentType+'; charset='+charset);
            }

            // Fix Content-Length
            if (this.headers.has('Transfer-Encoding')) {
                this.headers.remove('Content-Length');
            }

            if (request.isMethod('HEAD')) {
                // Cf. RFC2616 14.13
                this.content = '';
            }
        }

        // Fix protocol
        if ('HTTP/1.0' !== request.server.get('SERVER_PROTOCOL')) {
            this.protocolVersion = '1.1';
        }

        // Check if we need to send extra expire info headers
        if ('1.0' === this.protocolVersion && -1 !== this.headers.get('Cache-Control', '').indexOf('no-cache')) {
            this.headers.set('pragma', 'no-cache');
            this.headers.set('expires', -1);
        }

        this._ensureIEOverSSLCompatibility(request);

        return this;
    }

    /**
     * Sends the response through the given ServerResponse object.
     *
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     *
     * @returns {Promise<void>}
     */
    async sendResponse(req, res) {
        if (res.respond) {
            res.respond(Object.assign({ ':status': this.statusCode }, this.headers.all));
        } else {
            res.writeHead(this.statusCode, this.statusText, this.headers.all);
        }

        if (! this.isEmpty && this.content) {
            if (isFunction(this.content)) {
                await this.content(res);
            } else {
                await new Promise((resolve) => {
                    res.write(this.content, 'utf8', () => {
                        resolve();
                    });
                });
            }
        }

        res.end();
    }

    /**
     * Checks if we need to remove Cache-Control for SSL encrypted downloads when using IE < 9.
     * @see http://support.microsoft.com/kb/323308
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     *
     * @final
     */
    _ensureIEOverSSLCompatibility(request) {
        let match;
        if (-1 !== this.headers.get('Content-Disposition', '').indexOf('attachment') &&
            (match = request.server.get('HTTP_USER_AGENT').match(/MSIE (.*?);/i)) && request.isSecure) {
            if (match[1] && 9 > ~~match[1]) {
                this.headers.remove('Cache-Control');
            }
        }
    }
}

Response.HTTP_CONTINUE = 100;
Response.HTTP_SWITCHING_PROTOCOLS = 101;
Response.HTTP_PROCESSING = 102; // RFC2518
Response.HTTP_OK = 200;
Response.HTTP_CREATED = 201;
Response.HTTP_ACCEPTED = 202;
Response.HTTP_NON_AUTHORITATIVE_INFORMATION = 203;
Response.HTTP_NO_CONTENT = 204;
Response.HTTP_RESET_CONTENT = 205;
Response.HTTP_PARTIAL_CONTENT = 206;
Response.HTTP_MULTI_STATUS = 207; // RFC4918
Response.HTTP_ALREADY_REPORTED = 208; // RFC5842
Response.HTTP_IM_USED = 226; // RFC3229
Response.HTTP_MULTIPLE_CHOICES = 300;
Response.HTTP_MOVED_PERMANENTLY = 301;
Response.HTTP_FOUND = 302;
Response.HTTP_SEE_OTHER = 303;
Response.HTTP_NOT_MODIFIED = 304;
Response.HTTP_USE_PROXY = 305;
Response.HTTP_RESERVED = 306;
Response.HTTP_TEMPORARY_REDIRECT = 307;
Response.HTTP_PERMANENTLY_REDIRECT = 308; // RFC7238
Response.HTTP_BAD_REQUEST = 400;
Response.HTTP_UNAUTHORIZED = 401;
Response.HTTP_PAYMENT_REQUIRED = 402;
Response.HTTP_FORBIDDEN = 403;
Response.HTTP_NOT_FOUND = 404;
Response.HTTP_METHOD_NOT_ALLOWED = 405;
Response.HTTP_NOT_ACCEPTABLE = 406;
Response.HTTP_PROXY_AUTHENTICATION_REQUIRED = 407;
Response.HTTP_REQUEST_TIMEOUT = 408;
Response.HTTP_CONFLICT = 409;
Response.HTTP_GONE = 410;
Response.HTTP_LENGTH_REQUIRED = 411;
Response.HTTP_PRECONDITION_FAILED = 412;
Response.HTTP_REQUEST_ENTITY_TOO_LARGE = 413;
Response.HTTP_REQUEST_URI_TOO_LONG = 414;
Response.HTTP_UNSUPPORTED_MEDIA_TYPE = 415;
Response.HTTP_REQUESTED_RANGE_NOT_SATISFIABLE = 416;
Response.HTTP_EXPECTATION_FAILED = 417;
Response.HTTP_I_AM_A_TEAPOT = 418; // RFC2324
Response.HTTP_MISDIRECTED_REQUEST = 421; // RFC7540
Response.HTTP_UNPROCESSABLE_ENTITY = 422; // RFC4918
Response.HTTP_LOCKED = 423; // RFC4918
Response.HTTP_FAILED_DEPENDENCY = 424; // RFC4918
Response.HTTP_RESERVED_FOR_WEBDAV_ADVANCED_COLLECTIONS_EXPIRED_PROPOSAL = 425; // RFC2817
Response.HTTP_UPGRADE_REQUIRED = 426; // RFC2817
Response.HTTP_PRECONDITION_REQUIRED = 428; // RFC6585
Response.HTTP_TOO_MANY_REQUESTS = 429; // RFC6585
Response.HTTP_REQUEST_HEADER_FIELDS_TOO_LARGE = 431; // RFC6585
Response.HTTP_UNAVAILABLE_FOR_LEGAL_REASONS = 451;
Response.HTTP_INTERNAL_SERVER_ERROR = 500;
Response.HTTP_NOT_IMPLEMENTED = 501;
Response.HTTP_BAD_GATEWAY = 502;
Response.HTTP_SERVICE_UNAVAILABLE = 503;
Response.HTTP_GATEWAY_TIMEOUT = 504;
Response.HTTP_VERSION_NOT_SUPPORTED = 505;
Response.HTTP_VARIANT_ALSO_NEGOTIATES_EXPERIMENTAL = 506; // RFC2295
Response.HTTP_INSUFFICIENT_STORAGE = 507; // RFC4918
Response.HTTP_LOOP_DETECTED = 508; // RFC5842
Response.HTTP_NOT_EXTENDED = 510; // RFC2774
Response.HTTP_NETWORK_AUTHENTICATION_REQUIRED = 511; // RFC6585

Response.statusTexts = {
    100: 'Continue',
    101: 'Switching Protocols',
    102: 'Processing', // RFC2518
    103: 'Early Hints',
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    203: 'Non-Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',
    207: 'Multi-Status', // RFC4918
    208: 'Already Reported', // RFC5842
    226: 'IM Used', // RFC3229
    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    305: 'Use Proxy',
    307: 'Temporary Redirect',
    308: 'Permanent Redirect', // RFC7238
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Payload Too Large',
    414: 'URI Too Long',
    415: 'Unsupported Media Type',
    416: 'Range Not Satisfiable',
    417: 'Expectation Failed',
    418: 'I\'m a teapot', // RFC2324
    421: 'Misdirected Request', // RFC7540
    422: 'Unprocessable Entity', // RFC4918
    423: 'Locked', // RFC4918
    424: 'Failed Dependency', // RFC4918
    425: 'Reserved for WebDAV advanced collections expired proposal', // RFC2817
    426: 'Upgrade Required', // RFC2817
    428: 'Precondition Required', // RFC6585
    429: 'Too Many Requests', // RFC6585
    431: 'Request Header Fields Too Large', // RFC6585
    451: 'Unavailable For Legal Reasons', // RFC7725
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
    505: 'HTTP Version Not Supported',
    506: 'Variant Also Negotiates', // RFC2295
    507: 'Insufficient Storage', // RFC4918
    508: 'Loop Detected', // RFC5842
    510: 'Not Extended', // RFC2774
    511: 'Network Authentication Required', // RFC6585
};

module.exports = Response;
