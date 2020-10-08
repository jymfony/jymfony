declare namespace Jymfony.Contracts.HttpFoundation {
    export class RequestInterface {
        public static readonly definition: Newable<RequestInterface>;

        public server: ParameterBagInterface;
        public headers: HeaderBagInterface;
        public query: ParameterBagInterface;
        public request: ParameterBagInterface;
        public attributes: ParameterBagInterface;
        public cookies: ParameterBagInterface;
        public content?: Buffer;

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
         * Indicates whether this request originated from a trusted proxy.
         *
         * This can be useful to determine whether or not to trust the
         * contents of a proxy-specific header.
         *
         * @returns true if the request came from a trusted proxy, false otherwise
         */
        public readonly isFromTrustedProxy: boolean;
    }
}
