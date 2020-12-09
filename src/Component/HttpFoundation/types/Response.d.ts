declare namespace Jymfony.Component.HttpFoundation {
    import DateTimeInterface = Jymfony.Contracts.DateTime.DateTimeInterface;
    import ResponseInterface = Jymfony.Contracts.HttpFoundation.ResponseInterface;

    export class Response extends implementationOf(ResponseInterface) {
        public static readonly HTTP_CONTINUE = 100;
        public static readonly HTTP_SWITCHING_PROTOCOLS = 101;
        public static readonly HTTP_PROCESSING = 102; // RFC2518
        public static readonly HTTP_OK = 200;
        public static readonly HTTP_CREATED = 201;
        public static readonly HTTP_ACCEPTED = 202;
        public static readonly HTTP_NON_AUTHORITATIVE_INFORMATION = 203;
        public static readonly HTTP_NO_CONTENT = 204;
        public static readonly HTTP_RESET_CONTENT = 205;
        public static readonly HTTP_PARTIAL_CONTENT = 206;
        public static readonly HTTP_MULTI_STATUS = 207; // RFC4918
        public static readonly HTTP_ALREADY_REPORTED = 208; // RFC5842
        public static readonly HTTP_IM_USED = 226; // RFC3229
        public static readonly HTTP_MULTIPLE_CHOICES = 300;
        public static readonly HTTP_MOVED_PERMANENTLY = 301;
        public static readonly HTTP_FOUND = 302;
        public static readonly HTTP_SEE_OTHER = 303;
        public static readonly HTTP_NOT_MODIFIED = 304;
        public static readonly HTTP_USE_PROXY = 305;
        public static readonly HTTP_RESERVED = 306;
        public static readonly HTTP_TEMPORARY_REDIRECT = 307;
        public static readonly HTTP_PERMANENTLY_REDIRECT = 308; // RFC7238
        public static readonly HTTP_BAD_REQUEST = 400;
        public static readonly HTTP_UNAUTHORIZED = 401;
        public static readonly HTTP_PAYMENT_REQUIRED = 402;
        public static readonly HTTP_FORBIDDEN = 403;
        public static readonly HTTP_NOT_FOUND = 404;
        public static readonly HTTP_METHOD_NOT_ALLOWED = 405;
        public static readonly HTTP_NOT_ACCEPTABLE = 406;
        public static readonly HTTP_PROXY_AUTHENTICATION_REQUIRED = 407;
        public static readonly HTTP_REQUEST_TIMEOUT = 408;
        public static readonly HTTP_CONFLICT = 409;
        public static readonly HTTP_GONE = 410;
        public static readonly HTTP_LENGTH_REQUIRED = 411;
        public static readonly HTTP_PRECONDITION_FAILED = 412;
        public static readonly HTTP_REQUEST_ENTITY_TOO_LARGE = 413;
        public static readonly HTTP_REQUEST_URI_TOO_LONG = 414;
        public static readonly HTTP_UNSUPPORTED_MEDIA_TYPE = 415;
        public static readonly HTTP_REQUESTED_RANGE_NOT_SATISFIABLE = 416;
        public static readonly HTTP_EXPECTATION_FAILED = 417;
        public static readonly HTTP_I_AM_A_TEAPOT = 418; // RFC2324
        public static readonly HTTP_MISDIRECTED_REQUEST = 421; // RFC7540
        public static readonly HTTP_UNPROCESSABLE_ENTITY = 422; // RFC4918
        public static readonly HTTP_LOCKED = 423; // RFC4918
        public static readonly HTTP_FAILED_DEPENDENCY = 424; // RFC4918
        public static readonly HTTP_RESERVED_FOR_WEBDAV_ADVANCED_COLLECTIONS_EXPIRED_PROPOSAL = 425; // RFC2817
        public static readonly HTTP_UPGRADE_REQUIRED = 426; // RFC2817
        public static readonly HTTP_PRECONDITION_REQUIRED = 428; // RFC6585
        public static readonly HTTP_TOO_MANY_REQUESTS = 429; // RFC6585
        public static readonly HTTP_REQUEST_HEADER_FIELDS_TOO_LARGE = 431; // RFC6585
        public static readonly HTTP_UNAVAILABLE_FOR_LEGAL_REASONS = 451;
        public static readonly HTTP_INTERNAL_SERVER_ERROR = 500;
        public static readonly HTTP_NOT_IMPLEMENTED = 501;
        public static readonly HTTP_BAD_GATEWAY = 502;
        public static readonly HTTP_SERVICE_UNAVAILABLE = 503;
        public static readonly HTTP_GATEWAY_TIMEOUT = 504;
        public static readonly HTTP_VERSION_NOT_SUPPORTED = 505;
        public static readonly HTTP_VARIANT_ALSO_NEGOTIATES_EXPERIMENTAL = 506; // RFC2295
        public static readonly HTTP_INSUFFICIENT_STORAGE = 507; // RFC4918
        public static readonly HTTP_LOOP_DETECTED = 508; // RFC5842
        public static readonly HTTP_NOT_EXTENDED = 510; // RFC2774
        public static readonly HTTP_NETWORK_AUTHENTICATION_REQUIRED = 511; // RFC6585

        public static readonly statusTexts: Record<number, string>;

        public headers: ResponseHeaderBag;
        protected _charset: string | undefined;
        private _encoding: string;
        private _statusText: string;

        /**
         * Constructor.
         */
        __construct(content?: string | Buffer, status?: number, headers?: Record<string, string | string[]>): void;
        constructor(content?: string | Buffer, status?: number, headers?: Record<string, string | string[]>);

        /**
         * Is response invalid?
         *
         * @see http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
         *
         * @final
         */
        public readonly invalid: boolean;

        /**
         * Is response informative?
         *
         * @final
         */
        public readonly isInformational: boolean;

        /**
         * Is response successful?
         *
         * @final
         */
        public readonly isSuccessful: boolean;

        /**
         * Is the response a redirect?
         *
         * @final
         */
        public readonly isRedirection: boolean;

        /**
         * Is there a client error?
         *
         * @final
         */
        public readonly isClientError: boolean;

        /**
         * Was there a server side error?
         *
         * @final
         */
        public readonly isServerError: boolean;

        /**
         * Is the response OK?
         *
         * @final
         */
        public readonly isOk: boolean;

        /**
         * Is the response forbidden?
         *
         * @final
         */
        public readonly isForbidden: boolean;

        /**
         * Is the response a not found error?
         *
         * @final
         */
        public readonly isNotFound: boolean;

        /**
         * Is the response a redirect of some form?
         *
         * @final
         */
        isRedirect(location?: string | undefined): boolean;

        /**
         * Is the response empty?
         *
         * @final
         */
        public readonly isEmpty: boolean;

        /**
         * Sets the response content.
         */
        public content: Invokable<void> | Invokable<Promise<void>> | string;

        /**
         * Gets the response status code.
         */
        public readonly statusCode: number;

        /**
         * Gets the response status text.
         *
         * @returns {string}
         */
        public readonly statusText: string;

        /**
         * Sets the response status code and text.
         */
        setStatusCode(code: number, text?: string): void;

        /**
         * Marks the response as "private".
         *
         * It makes the response ineligible for serving other clients.
         *
         * @final
         */
        setPrivate(): this;

        /**
         * Marks the response as "public".
         *
         * It makes the response eligible for serving other clients.
         *
         * @final
         */
        setPublic(): this;

        /**
         * Marks the response as "immutable".
         *
         * @final
         */
        setImmutable(immutable?: boolean): this;

        /**
         * Returns true if the response is marked as "immutable".
         *
         * @final
         */
        public readonly immutable: boolean;


        /**
         * Returns true if the response must be revalidated by caches.
         *
         * This method indicates that the response must not be served stale by a
         * cache in any circumstance without first revalidating with the origin.
         * When present, the TTL of the response should not be overridden to be
         * greater than the value provided by the origin.
         *
         * @final
         */
        public readonly mustRevalidate: boolean;

        /**
         * Returns the Date header as a DateTime instance.
         *
         * @throws {RuntimeException} When the header is not parseable
         *
         * @final
         */
        public readonly date: DateTimeInterface;

        /**
         * Sets the Date header.
         *
         * @final
         */
        setDate(date: DateTimeInterface): this;

        /**
         * Returns the age of the response in seconds.
         *
         * @final
         */
        public readonly age: number;

        /**
         * Marks the response stale by setting the Age header to be equal to the maximum age of the response.
         */
        expire: Response;

        /**
         * Returns the value of the Expires header as a DateTime instance.
         *
         * @final
         */
        public readonly expires: this | undefined;

        /**
         * Sets the Expires HTTP header with a DateTime instance.
         *
         * Passing null as value will remove the header.
         *
         * @final
         */
        setExpires(date?: DateTimeInterface | number | undefined): this;

        /**
         * Returns the number of seconds after the time specified in the response's Date
         * header when the response should no longer be considered fresh.
         *
         * First, it checks for a s-maxage directive, then a max-age directive, and then it falls
         * back on an expires header. It returns undefined when no maximum age can be established.
         *
         * @final
         */
        public readonly maxAge: number | undefined;

        /**
         * Sets the number of seconds after which the response should no longer be considered fresh.
         *
         * This methods sets the Cache-Control max-age directive.
         *
         * @final
         */
        setMaxAge(value: number): this;

        /**
         * Sets the number of seconds after which the response should no longer be considered fresh by shared caches.
         *
         * This methods sets the Cache-Control s-maxage directive.
         *
         * @final
         */
        setSharedMaxAge(value: number): this;

        /**
         * Returns the response's time-to-live in seconds.
         *
         * It returns undefined when no freshness information is present in the response.
         *
         * When the responses TTL is <= 0, the response may not be served from cache without first
         * revalidating with the origin.
         *
         * @final
         */
        public readonly ttl: number | undefined;

        /**
         * Sets the response's time-to-live for shared caches in seconds.
         *
         * This method adjusts the Cache-Control/s-maxage directive.
         *
         * @final
         */
        setTtl(seconds: number): this;

        /**
         * Sets the response's time-to-live for private/client caches in seconds.
         *
         * This method adjusts the Cache-Control/max-age directive.
         *
         * @final
         */
        setClientTtl(seconds: number): this;

        /**
         * The Last-Modified HTTP header as a DateTime instance.
         *
         * @throws {RuntimeException} When the HTTP header is not parseable
         *
         * @final
         */
        public lastModified: DateTimeInterface | undefined;

        /**
         * Returns the literal value of the ETag HTTP header.
         *
         * @final
         */
        public readonly etag: string;

        /**
         * Sets the ETag value.
         *
         * @param etag The ETag unique identifier or null to remove the header
         * @param weak Whether you want a weak ETag or not
         *
         * @final
         */
        setEtag(etag?: string | undefined, weak?: boolean): this;

        /**
         * Returns true if the response includes a Vary header.
         *
         * @final
         */
        hasVary(): boolean;

        /**
         * Returns an array of header names given in the Vary header.
         *
         * @final
         */
        public readonly vary: string[];

        /**
         * Sets the Vary header.
         *
         * @param headers
         * @param [replace = true] Whether to replace the actual value or not (true by default)
         *
         * @final
         */
        setVary(headers: string | string[], replace?: boolean): this;

        /**
         * The response charset.
         *
         * @returns {string}
         */
        public charset: string | undefined;

        /**
         * The HTTP protocol version (1.0 or 1.1).
         *
         * @final
         */
        public protocolVersion: string;

        /**
         * Prepares the Response before it is sent to the client.
         *
         * This method tweaks the Response to ensure that it is
         * compliant with RFC 2616. Most of the changes are based on
         * the Request that is "associated" with this Response.
         */
        prepare(request: Request): Promise<this>;

        /**
         * Sends the response through the given ServerResponse object.
         */
        sendResponse(req: any, res: any): Promise<void>;

        /**
         * Sets the encoding for this response.
         *
         * @protected
         * @final
         */
        protected _setEncodingForCompression(request: Request): void;

        /**
         * Checks if we need to remove Cache-Control for SSL encrypted downloads when using IE < 9.
         * @see http://support.microsoft.com/kb/323308
         *
         * @param {Jymfony.Component.HttpFoundation.Request} request
         *
         * @protected
         * @final
         */
        protected _ensureIEOverSSLCompatibility(request: Request): void;
    }
}
