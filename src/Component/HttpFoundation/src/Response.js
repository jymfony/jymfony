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
