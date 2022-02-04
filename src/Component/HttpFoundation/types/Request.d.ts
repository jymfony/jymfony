declare namespace Jymfony.Component.HttpFoundation {
    import SessionInterface = Jymfony.Component.HttpFoundation.Session.SessionInterface;

    export class Request {
        public static readonly METHOD_HEAD = 'HEAD';
        public static readonly METHOD_GET = 'GET';
        public static readonly METHOD_POST = 'POST';
        public static readonly METHOD_PUT = 'PUT';
        public static readonly METHOD_PATCH = 'PATCH';
        public static readonly METHOD_DELETE = 'DELETE';
        public static readonly METHOD_PURGE = 'PURGE';
        public static readonly METHOD_OPTIONS = 'OPTIONS';
        public static readonly METHOD_TRACE = 'TRACE';
        public static readonly METHOD_CONNECT = 'CONNECT';

        public static readonly HEADER_FORWARDED = 0b00001; // When using RFC 7239
        public static readonly HEADER_X_FORWARDED_FOR = 0b00010;
        public static readonly HEADER_X_FORWARDED_HOST = 0b00100;
        public static readonly HEADER_X_FORWARDED_PROTO = 0b01000;
        public static readonly HEADER_X_FORWARDED_PORT = 0b10000;
        public static readonly HEADER_X_FORWARDED_ALL = 0b11110; // All "X-Forwarded-*" headers
        public static readonly HEADER_X_FORWARDED_AWS_ELB = 0b11010; // AWS ELB doesn't send X-Forwarded-Host

        public static readonly ATTRIBUTE_PARENT_REQUEST = '_parent_request';

        public server: ParameterBag;
        public headers: HeaderBag;
        public query: ParameterBag;
        public request: ParameterBag;
        public attributes: ParameterBag;
        public cookies: ParameterBag;
        public content?: Buffer;

        protected _format?: string;

        private _isHostValid: boolean;
        private _isFromTrustedProxy: boolean;
        private _method?: string;
        private _url: any;

        /**
         * Constructor.
         *
         * @param url Request URL
         * @param [request = {}] Request parameters (POST)
         * @param [attributes = {}] Request attributes (parameters parsed from path info, etc)
         * @param [headers = {}] Headers or parameters injected by the web server
         * @param [server = {}] Request server paramters (remote address, etc)
         * @param [content] Request content.
         */
        __construct(url: string, request?: Record<string, string>, attributes?: Record<string, any>, headers?: Record<string, string>, server?: Record<string, string>, content?: Buffer | undefined): void;
        constructor(url: string, request?: Record<string, string>, attributes?: Record<string, any>, headers?: Record<string, string>, server?: Record<string, string>, content?: Buffer | undefined);

        /**
         * Creates a new Request object
         *
         * @param url The url of the request
         * @param [method = 'GET'] The HTTP method of the request
         * @param [parameters = {}] Request parameters (POST)
         * @param [headers = {}] Headers or parameters injected by the web server
         * @param [server = {}] Request server paramters (remote address, etc)
         * @param [content] Request content.
         */
        static create(url: string, method?: string, parameters?: Record<string, string>, headers?: Record<string, string>, server?: Record<string, string>, content?: Buffer | undefined): Request;

        /**
         * Sets a list of trusted proxies.
         *
         * You should only list the reverse proxies that you manage directly.
         *
         * @param proxies A list of trusted proxies
         * @param trustedHeaderSet A bit field of Request.HEADER_*, to set which headers to trust from your proxies
         *
         * @throws {InvalidArgumentException} When trustedHeaderSet is invalid
         */
        static setTrustedProxies(proxies: string[], trustedHeaderSet: number): void;

        /**
         * Gets the set of trusted headers from trusted proxies.
         *
         * @returns A bit field of Request.HEADER_* that defines which headers are trusted from your proxies
         */
        static getTrustedHeaderSet(): number;

        /**
         * Sets a list of trusted host patterns.
         *
         * You should only list the hosts you manage using regexs.
         *
         * @param hostPatterns A list of trusted host patterns
         */
        static setTrustedHosts(hostPatterns: string[]): void;

        /**
         * Enables support for the _method request parameter to determine the intended HTTP method.
         *
         * Be warned that enabling this feature might lead to CSRF issues in your code.
         * Check that you are using CSRF tokens when required.
         * If the HTTP method parameter override is enabled, an html-form with method "POST" can be altered
         * and used to send a "PUT" or "DELETE" request via the _method request parameter.
         * If these methods are not protected against CSRF, this presents a possible vulnerability.
         *
         * The HTTP method can only be overridden when the real HTTP method is POST.
         */
        static enableHttpMethodParameterOverride(): void;

        /**
         * Gets the mime type associated with the format.
         *
         * @param format The format
         *
         * @returns The associated mime type (undefined if not found)
         */
        static getMimeType(format: string): string;

        /**
         * Initializes a request object.
         * This will re-initialize all the properties.
         *
         * @param url Request URL
         * @param [request = {}] Request parameters (POST)
         * @param [attributes = {}] Request attributes (parameters parsed from path info, etc)
         * @param [headers = {}] Headers or parameters injected by the web server
         * @param [server = {}] Request server paramters (remote address, etc)
         * @param [content] Request content.
         */
        initialize(url: string, request?: Record<string, string>, attributes?: Record<string, any>, headers?: Record<string, string>, server?: Record<string, string>, content?: Buffer | undefined): void;

        /**
         * Clones a request and overrides some of its parameters.
         *
         * @param [url] Request URL
         * @param [request] Request parameters (POST)
         * @param [attributes] Request attributes (parameters parsed from path info, etc)
         * @param [headers] Headers or parameters injected by the web server
         * @param [server] Request server paramters (remote address, etc)
         */
        duplicate(url?: string, request?: Record<string, string>, attributes?: Record<string, any>, headers?: Record<string, string>, server?: Record<string, string>): Request;

        /**
         * Gets a serializable representation of this request.
         */
        toJson(): Record<string, string | Record<string, string> | string[]>;

        /**
         * Whether the request is secure or not.
         *
         * This method can read the client protocol from the "X-Forwarded-Proto" header
         * when trusted proxies were set via "setTrustedProxies()".
         *
         * The "X-Forwarded-Proto" header must contain the protocol: "https" or "http" or "wss".
         */
        public readonly isSecure: boolean;

        /**
         * The request's scheme.
         */
        public readonly scheme: string;

        /**
         * The client IP address.
         *
         * This method can read the client IP address from the "X-Forwarded-For" header
         * when trusted proxies were set via "setTrustedProxies()". The "X-Forwarded-For"
         * header value is a comma+space separated list of IP addresses, the left-most
         * being the original client, and each successive proxy that passed the request
         * adding the IP address where it received the request from.
         *
         * @returns The client IP address
         *
         * @see _getClientIps()
         * @see http://en.wikipedia.org/wiki/X-Forwarded-For
         */
        public readonly clientIp: string | undefined;

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
         * @returns The raw path (i.e. not urldecoded)
         */
        public readonly pathInfo: string;

        /**
         * The host name.
         *
         * This method can read the client host name from the "X-Forwarded-Host" header
         * when trusted proxies were set via "setTrustedProxies()".
         *
         * The "X-Forwarded-Host" header must contain the client host name.
         *
         * @throws SuspiciousOperationException when the host name is invalid or not trusted
         */
        public readonly host: string;

        /**
         * The HTTP host being requested.
         *
         * The port name will be appended to the host if it's non-standard.
         *
         * @returns {string}
         */
        public readonly httpHost: string;

        /**
         * The scheme and HTTP host.
         *
         * If the URL was called with basic authentication, the user
         * and the password are not added to the generated string.
         *
         * @returns The scheme and HTTP host
         */
        public readonly schemeAndHttpHost: string;

        /**
         * The full URI for this request.
         */
        public readonly uri: string;

        /**
         * The port on which the request is made.
         *
         * This method can read the client port from the "X-Forwarded-Port" header
         * when trusted proxies were set via "setTrustedProxies()".
         *
         * The "X-Forwarded-Port" header must contain the client port.
         */
        public readonly port: number;

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
         */
        public method: string;

        /**
         * The "real" request method.
         *
         * @see method
         */
        public readonly realMethod: string;

        /**
         * Checks if the request method is of specified type.
         *
         * @param method Uppercase request method (GET, POST etc)
         */
        isMethod(method: string): boolean;

        /**
         * Checks whether or not the method is safe.
         *
         * @see https://tools.ietf.org/html/rfc7231#section-4.2.1
         */
        public readonly isMethodSafe: boolean;

        /**
         * Returns true if the request is a XMLHttpRequest.
         *
         * It works if your JavaScript library sets an X-Requested-With HTTP header.
         * It is known to work with common JavaScript frameworks:
         *
         * @see http://en.wikipedia.org/wiki/List_of_Ajax_frameworks#JavaScript
         *
         * @returns true if the request is an XMLHttpRequest, false otherwise
         */
        public readonly isXmlHttpRequest: boolean;

        /**
         * Returns the protocol version.
         *
         * If the application is behind a proxy, the protocol version used in the
         * requests between the client and the proxy and between the proxy and the
         * server might be different. This returns the former (from the "Via" header)
         * if the proxy is trusted (see "setTrustedProxies()"), otherwise it returns
         * the latter (from the "SERVER_PROTOCOL" server parameter).
         */
        public readonly protocolVersion: string;

        /**
         * Gets the request format.
         *
         * Here is the process to determine the format:
         *
         *  * format defined by the user (with setRequestFormat())
         *  * _format request attribute
         *  * defaultFormat
         *
         * @param [defaultFormat = 'html'] The default format
         *
         * @returns The request format
         */
        getRequestFormat(defaultFormat?: string): string;

        /**
         * Sets the request format.
         *
         * @param format The request format
         */
        setRequestFormat(format: string): void;

        /**
         * Indicates whether this request originated from a trusted proxy.
         *
         * This can be useful to determine whether or not to trust the
         * contents of a proxy-specific header.
         *
         * @returns true if the request came from a trusted proxy, false otherwise
         */
        public readonly isFromTrustedProxy: boolean;

        /**
         * The Session.
         */
        public session?: SessionInterface;

        /**
         * Whether the request contains a Session which was started in one of the
         * previous requests.
         */
        hasPreviousSession(): boolean;

        /**
         * Whether the request contains a Session object.
         *
         * This method does not give any information about the state of the session object,
         * like whether the session is started or not. It is just a way to check if this Request
         * is associated with a Session instance.
         *
         * @returns true when the Request contains a Session object, false otherwise
         */
        hasSession(): boolean;

        /**
         * Returns the client IP addresses.
         *
         * In the returned array the most trusted IP address is first, and the
         * least trusted one last. The "real" client IP address is the last one,
         * but this is also the least trusted one. Trusted proxies are stripped.
         *
         * Use this method carefully; you should use getClientIp() instead.
         *
         * @see getClientIp()
         */
        private _getClientIps(): string[];

        /**
         * Returns an array of trusted forwarded values.
         */
        private _getTrustedValues(type: number, ip?: string | undefined): string[];

        private _normalizeAndFilterClientIps(clientIps: string[], ip: string): any;
    }
}
