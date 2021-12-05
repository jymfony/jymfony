import { format, parse } from 'url';
import { isIP } from 'net';
import { stringify as qsStringify } from 'querystring';

const ConflictingHeadersException = Jymfony.Component.HttpFoundation.Exception.ConflictingHeadersException;
const SuspiciousOperationException = Jymfony.Component.HttpFoundation.Exception.SuspiciousOperationException;
const HeaderBag = Jymfony.Component.HttpFoundation.HeaderBag;
const Ip = Jymfony.Component.HttpFoundation.Ip;
const ParameterBag = Jymfony.Component.HttpFoundation.ParameterBag;
const RequestInterface = Jymfony.Contracts.HttpFoundation.RequestInterface;

let _trustedProxies = [];
let _trustedHeaderSet = 0;
let _trustedHostPatterns = [];
let _trustedHosts = [];
let _httpMethodParameterOverride = false;

const _trustedHeaders = {};
const _forwardedParams = {};

let formats = undefined;

const initializeFormats = function () {
    formats = {
        'html': [ 'text/html', 'application/xhtml+xml' ],
        'txt': [ 'text/plain' ],
        'js': [ 'application/javascript', 'application/x-javascript', 'text/javascript' ],
        'css': [ 'text/css' ],
        'json': [ 'application/json', 'application/x-json' ],
        'xml': [ 'text/xml', 'application/xml', 'application/x-xml' ],
        'rdf': [ 'application/rdf+xml' ],
        'atom': [ 'application/atom+xml' ],
        'rss': [ 'application/rss+xml' ],
        'form': [ 'application/x-www-form-urlencoded' ],
    };
};

/**
 * @memberOf Jymfony.Component.HttpFoundation
 */
export default class Request extends implementationOf(RequestInterface) {
    /**
     * Constructor.
     *
     * @param {string} url Request URL
     * @param {Object.<string, string>} [request = {}] Request parameters (POST)
     * @param {Object.<string, *>} [attributes = {}] Request attributes (parameters parsed from path info, etc)
     * @param {Object.<string, string>} [headers = {}] Headers or parameters injected by the web server
     * @param {Object.<string, string>} [server = {}] Request server paramters (remote address, etc)
     * @param {undefined|Buffer} [content] Request content.
     */
    __construct(url, request = {}, attributes = {}, headers = {}, server = {}, content = undefined) {
        /**
         * @type {boolean}
         *
         * @private
         */
        this._isHostValid = undefined;

        /**
         * @type {string}
         *
         * @protected
         */
        this._format = undefined;

        /**
         * @type {Jymfony.Component.HttpFoundation.ParameterBag}
         */
        this.server = undefined;

        /**
         * @type {Jymfony.Component.HttpFoundation.HeaderBag}
         */
        this.headers = undefined;

        /**
         * @type {Url}
         *
         * @private
         */
        this._url = undefined;

        /**
         * @type {Jymfony.Component.HttpFoundation.ParameterBag}
         */
        this.query = undefined;

        /**
         * @type {Jymfony.Component.HttpFoundation.ParameterBag}
         */
        this.request = undefined;

        /**
         * @type {Jymfony.Component.HttpFoundation.ParameterBag}
         */
        this.attributes = undefined;

        /**
         * @type {Jymfony.Component.HttpFoundation.ParameterBag}
         */
        this.cookies = undefined;

        /**
         * @type {Buffer}
         */
        this.content = undefined;

        /**
         * @type {string}
         *
         * @private
         */
        this._method = undefined;

        /**
         * @type {Jymfony.Component.HttpFoundation.Session.SessionInterface}
         *
         * @private
         */
        this._session = undefined;

        this.initialize(url, request, attributes, headers, server, content);
    }

    /**
     * Creates a new Request object
     *
     * @param {string} url The url of the request
     * @param {string} [method = 'GET'] The HTTP method of the request
     * @param {Object.<string, string>} [parameters = {}] Request parameters (POST)
     * @param {Object.<string, string>} [headers = {}] Headers or parameters injected by the web server
     * @param {Object.<string, string>} [server = {}] Request server paramters (remote address, etc)
     * @param {undefined|Buffer} [content] Request content.
     *
     * @returns {Jymfony.Component.HttpFoundation.Request}
     */
    static create(url, method = __self.METHOD_GET, parameters = {}, headers = {}, server = {}, content = undefined) {
        const parsedUrl = parse(url);
        const hostname = parsedUrl.hostname;

        server = Object.assign({
            SERVER_NAME: hostname,
            SERVER_PORT: 80,
            REMOTE_ADDR: '127.0.0.1',
            SERVER_PROTOCOL: 'HTTP/1.1',
            SCHEME: parsedUrl.protocol ? parsedUrl.protocol.replace(/:$/, '') : 'http',
        }, server);
        server.REQUEST_METHOD = method;

        headers = Object.assign({
            Host: hostname,
            'User-Agent': 'Jymfony',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-us,en;q=0.5',
            'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.7',
        }, headers);

        let request, query;
        switch (method.toUpperCase()) {
            case __self.METHOD_GET:
                request = {};
                query = parameters;
                break;

            default:
                if (! server.CONTENT_TYPE) {
                    server.CONTENT_TYPE = 'application/x-www-form-urlencoded';
                }

                request = parameters;
                query = {};
                break;
        }

        query = Object.assign(__jymfony.parse_query_string(parsedUrl.query), query);
        parsedUrl.query = qsStringify(query);
        url = format(parsedUrl);

        return new __self(url, request, {}, headers, server, content);
    }

    /**
     * Sets a list of trusted proxies.
     *
     * You should only list the reverse proxies that you manage directly.
     *
     * @param {string[]} proxies A list of trusted proxies
     * @param {int} trustedHeaderSet A bit field of Request.HEADER_*, to set which headers to trust from your proxies
     *
     * @throws {InvalidArgumentException} When trustedHeaderSet is invalid
     */
    static setTrustedProxies(proxies, trustedHeaderSet) {
        if ((trustedHeaderSet & (__self.HEADER_X_FORWARDED_ALL | __self.HEADER_FORWARDED) !== trustedHeaderSet)) {
            throw new InvalidArgumentException('Invalid trusted header set');
        }

        _trustedProxies = proxies;
        _trustedHeaderSet = trustedHeaderSet;
    }

    /**
     * Gets the set of trusted headers from trusted proxies.
     *
     * @returns {int} A bit field of Request.HEADER_* that defines which headers are trusted from your proxies
     */
    static getTrustedHeaderSet() {
        return _trustedHeaderSet;
    }

    /**
     * Sets a list of trusted host patterns.
     *
     * You should only list the hosts you manage using regexs.
     *
     * @param {string[]} hostPatterns A list of trusted host patterns
     */
    static setTrustedHosts(hostPatterns) {
        _trustedHostPatterns = hostPatterns.map(pattern => new RegExp(pattern, 'i'));
        // We need to reset trusted hosts on trusted host patterns change
        _trustedHosts = [];
    }

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
    static enableHttpMethodParameterOverride() {
        _httpMethodParameterOverride = true;
    }

    /**
     * Gets the mime type associated with the format.
     *
     * @param {string} format The format
     *
     * @returns {string} The associated mime type (undefined if not found)
     */
    static getMimeType(format) {
        if (undefined === formats) {
            initializeFormats();
        }

        return formats[format];
    }

    /**
     * Initializes a request object.
     * This will re-initialize all the properties.
     *
     * @param {string} url Request URL
     * @param {Object.<string, string>} [request = {}] Request parameters (POST)
     * @param {Object.<string, *>} [attributes = {}] Request attributes (parameters parsed from path info, etc)
     * @param {Object.<string, string>} [headers = {}] Headers or parameters injected by the web server
     * @param {Object.<string, string>} [server = {}] Request server paramters (remote address, etc)
     * @param {undefined|Buffer} [content] Request content.
     */
    initialize(url, request = {}, attributes = {}, headers = {}, server = {}, content = undefined) {
        this._isHostValid = true;
        this._format = undefined;

        if (undefined === server.REMOTE_ADDR) {
            server.REMOTE_ADDR = '127.0.0.1';
        }

        this.server = new ParameterBag(server);
        this.headers = new HeaderBag(headers);

        const parsedUrl = parse(url);
        parsedUrl.protocol = this.scheme;
        parsedUrl.hostname = parsedUrl.host = this.httpHost;
        this._url = parse(format(parsedUrl));

        this.query = new ParameterBag(__jymfony.parse_query_string(this._url.query));
        this.request = new ParameterBag(request);
        this.attributes = new ParameterBag(attributes);
        this.cookies = new ParameterBag(this.headers.cookies);
        this.content = content;
        this._method = undefined;
        this._session = undefined;
    }

    /**
     * Clones a request and overrides some of its parameters.
     *
     * @param {string} [url] Request URL
     * @param {Object.<string, string>} [request] Request parameters (POST)
     * @param {Object.<string, *>} [attributes] Request attributes (parameters parsed from path info, etc)
     * @param {Object.<string, string>} [headers] Headers or parameters injected by the web server
     * @param {Object.<string, string>} [server] Request server paramters (remote address, etc)
     *
     * @returns {Jymfony.Component.HttpFoundation.Request}
     */
    duplicate(url = undefined, request = undefined, attributes = undefined, headers = undefined, server = undefined) {
        const dup = __jymfony.clone(this);

        if (undefined !== url) {
            dup._url = parse(url);
            dup.query = new ParameterBag(__jymfony.parse_query_string(dup._url.query));
        }

        if (undefined !== request) {
            dup.request = new ParameterBag(request);
        }

        if (undefined !== attributes) {
            dup.attributes = new ParameterBag(attributes);
        }

        if (undefined !== headers) {
            dup.headers = new HeaderBag(headers);
            dup.cookies = new ParameterBag(dup.headers.cookies);
        }

        if (undefined !== server) {
            dup.server = new ParameterBag(server);
        }

        if (! dup.getRequestFormat(undefined)) {
            dup.setRequestFormat(this.getRequestFormat(undefined));
        }

        return dup;
    }

    /**
     * Gets a serializable representation of this request.
     *
     * @returns {Object.<string, string|Object.<string, string>|string[]>}
     */
    toJson() {
        return {
            method: this.method,
            uri: this.uri,
            request: this.request.all,
            headers: this.headers.all,
            server: this.server.all,
            content: String(this.content),
        };
    }

    /**
     * Checks whether the request is secure or not.
     *
     * This method can read the client protocol from the "X-Forwarded-Proto" header
     * when trusted proxies were set via "setTrustedProxies()".
     *
     * The "X-Forwarded-Proto" header must contain the protocol: "https" or "http" or "wss".
     *
     * @returns {boolean}
     */
    get isSecure() {
        const secureProtos = [ 'https', 'ssl', 'wss' ];
        if (this.isFromTrustedProxy) {
            const proto = this._getTrustedValues(__self.HEADER_X_FORWARDED_PROTO);

            return -1 !== secureProtos.indexOf(proto[0]);
        }

        return -1 !== secureProtos.indexOf(this.scheme);
    }

    /**
     * Gets the request's scheme.
     *
     * @returns {string}
     */
    get scheme() {
        const scheme = this.server.get('SCHEME', 'http');
        if (this.isFromTrustedProxy) {
            const proto = this._getTrustedValues(__self.HEADER_X_FORWARDED_PROTO);
            return proto[0] || scheme;
        }

        return scheme;
    }

    /**
     * Returns the client IP address.
     *
     * This method can read the client IP address from the "X-Forwarded-For" header
     * when trusted proxies were set via "setTrustedProxies()". The "X-Forwarded-For"
     * header value is a comma+space separated list of IP addresses, the left-most
     * being the original client, and each successive proxy that passed the request
     * adding the IP address where it received the request from.
     *
     * @returns {string|undefined} The client IP address
     *
     * @see _getClientIps()
     * @see http://en.wikipedia.org/wiki/X-Forwarded-For
     */
    get clientIp() {
        const ipAddresses = this._getClientIps();

        return ipAddresses[0];
    }

    /**
     * Returns the path being requested.
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
    get pathInfo() {
        return this._url.pathname;
    }

    /**
     * Returns the host name.
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
    get host() {
        let host = '';
        if (this.isFromTrustedProxy && 0 < (host = this._getTrustedValues(__self.HEADER_X_FORWARDED_HOST)).length) {
            host = host[0];
        } else if (! (host = this.headers.get('HOST') || this.headers.get(':authority'))) {
            if (! (host = this.server.get('SERVER_NAME'))) {
                host = this.server.get('SERVER_ADDR', '');
            }
        }

        // Trim and remove port number from host
        // Host is lowercase as per RFC 952/2181
        host = __jymfony.trim(host)
            .replace(/:\d+$/g, '')
            .toLowerCase();

        // As the host can come from the user (HTTP_HOST and depending on the configuration, SERVER_NAME too can come from the user)
        // Check that it does not contain forbidden characters (see RFC 952 and RFC 2181)
        // Use preg_replace() instead of preg_match() to prevent DoS attacks with long host names
        if (host && '' !== host.replace(/(?:^\[)?[a-zA-Z0-9-:\]_]+\.?/g, '')) {
            if (! this._isHostValid) {
                return '';
            }

            this._isHostValid = false;

            throw new SuspiciousOperationException(__jymfony.sprintf('Invalid Host "%s".', host));
        }

        if (0 < _trustedHostPatterns.length) {
            // To avoid host header injection attacks, you should provide a list of trusted host patterns

            if (-1 !== _trustedHosts.indexOf(host)) {
                return host;
            }

            for (const regex of _trustedHostPatterns) {
                if (regex.test(host)) {
                    _trustedHosts.push(host);

                    return host;
                }
            }

            if (! this._isHostValid) {
                return '';
            }

            this._isHostValid = false;

            throw new SuspiciousOperationException(__jymfony.sprintf('Untrusted Host "%s".', host));
        }

        return host;
    }

    /**
     * Returns the HTTP host being requested.
     *
     * The port name will be appended to the host if it's non-standard.
     *
     * @returns {string}
     */
    get httpHost() {
        const scheme = this.scheme;
        const port = this.port;

        if (('http' === scheme && 80 === port) || ('https' === scheme && 443 === port) ||
            ('ws' === scheme && 80 === port) || ('wss' === scheme && 433 === port)) {
            return this.host;
        }

        return this.host + ':' + port;
    }

    /**
     * Gets the scheme and HTTP host.
     *
     * If the URL was called with basic authentication, the user
     * and the password are not added to the generated string.
     *
     * @returns {string} The scheme and HTTP host
     */
    get schemeAndHttpHost() {
        return this.scheme + '://' + this.httpHost;
    }

    /**
     * Gets the full URI for this request.
     *
     * @returns {string}
     */
    get uri() {
        return this._url.href;
    }

    /**
     * Returns the port on which the request is made.
     *
     * This method can read the client port from the "X-Forwarded-Port" header
     * when trusted proxies were set via "setTrustedProxies()".
     *
     * The "X-Forwarded-Port" header must contain the client port.
     *
     * @returns {int}
     */
    get port() {
        let host;
        if (this.isFromTrustedProxy && 0 < (host = this._getTrustedValues(__self.HEADER_X_FORWARDED_PORT)).length) {
            host = ~~host[0];
        } else if (this.isFromTrustedProxy && 0 < (host = this._getTrustedValues(__self.HEADER_X_FORWARDED_HOST)).length) {
            host = ~~host[0];
        } else if (! (host = this.headers.get('HOST') || this.headers.get(':authority'))) {
            return ~~this.server.get('SERVER_PORT');
        }

        host = host.toString();
        if ('[' === host[0]) {
            host = host.substr(host.lastIndexOf(']'));
        }

        const pos = host.lastIndexOf(':');
        if (-1 !== pos) {
            return ~~(host.substr(pos + 1));
        }

        return 'https' === this.scheme || 'wss' === this.scheme ? 443 : 80;
    }

    /**
     * Sets the request method.
     *
     * @param {string} method
     */
    set method(method) {
        this._method = undefined;
        this.server.set('REQUEST_METHOD', method);
    }

    /**
     * Gets the request "intended" method.
     *
     * If the X-HTTP-Method-Override header is set, and if the method is a POST,
     * then it is used to determine the "real" intended HTTP method.
     *
     * The _method request parameter can also be used to determine the HTTP method,
     * but only if enableHttpMethodParameterOverride() has been called.
     *
     * The method is always an uppercased string.
     *
     * @returns {string} The request method
     *
     * @see realMethod
     */
    get method() {
        if (! this._method) {
            this._method = this.server.get('REQUEST_METHOD', 'GET').toUpperCase();

            if ('POST' === this._method) {
                const method = this.headers.get('X-HTTP-METHOD-OVERRIDE');
                if (method) {
                    this._method = method.toUpperCase();
                } else if (_httpMethodParameterOverride) {
                    this._method = this.request.get('_method', this.query.get('_method', 'POST')).toUpperCase();
                }
            }
        }

        return this._method;
    }

    /**
     * Gets the "real" request method.
     *
     * @returns {string} The request method
     *
     * @see method
     */
    get realMethod() {
        return this.server.get('REQUEST_METHOD', 'GET').toUpperCase();
    }

    /**
     * Checks if the request method is of specified type.
     *
     * @param {string} method Uppercase request method (GET, POST etc)
     *
     * @returns {boolean}
     */
    isMethod(method) {
        return this.method === method.toUpperCase();
    }

    /**
     * Checks whether or not the method is safe.
     *
     * @see https://tools.ietf.org/html/rfc7231#section-4.2.1
     *
     * @returns {boolean}
     */
    get isMethodSafe() {
        switch (this.method) {
            case 'GET':
            case 'HEAD':
            case 'OPTIONS':
            case 'TRACE':
                return true;
        }

        return false;
    }

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
    get isXmlHttpRequest() {
        return 'XMLHttpRequest' === this.headers.get('X-Requested-With');
    }

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
    get protocolVersion() {
        if (this.isFromTrustedProxy) {
            const matches = this.headers.get('Via', '').match(new RegExp('^(HTTP/)?([1-9]\.[0-9]) '));

            if (matches) {
                return 'HTTP/'.matches[2];
            }
        }

        return this.server.get('SERVER_PROTOCOL');
    }

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
    getRequestFormat(defaultFormat = 'html') {
        if (undefined === this._format) {
            this._format = this.attributes.get('_format');
        }

        return undefined === this._format ? defaultFormat : this._format;
    }

    /**
     * Sets the request format.
     *
     * @param {string} format The request format
     */
    setRequestFormat(format) {
        this._format = format;
    }

    /**
     * Indicates whether this request originated from a trusted proxy.
     *
     * This can be useful to determine whether or not to trust the
     * contents of a proxy-specific header.
     *
     * @returns {boolean} true if the request came from a trusted proxy, false otherwise
     */
    get isFromTrustedProxy() {
        if (! this.server.has('REMOTE_ADDR')) {
            return false;
        }

        return _trustedProxies.length && Ip.check(this.server.get('REMOTE_ADDR'), _trustedProxies);
    }

    /**
     * Gets the Session.
     *
     * @returns {undefined|Jymfony.Component.HttpFoundation.Session.SessionInterface} The session
     */
    get session() {
        const session = this._session;
        if (isFunction(session)) {
            this._session = session();
        }

        if (! session) {
            throw new BadMethodCallException('Session has not been set');
        }

        return this._session;
    }

    /**
     * Sets the Session.
     *
     * @param {Jymfony.Component.HttpFoundation.Session.SessionInterface} session The Session
     */
    set session(session) {
        this._session = session;
    }

    /**
     * Whether the request contains a Session which was started in one of the
     * previous requests.
     *
     * @returns {boolean}
     */
    hasPreviousSession() {
        // The check for this.session avoids malicious users trying to fake a session cookie with proper name
        return this.hasSession() && this.cookies.has(this.session.name);
    }

    /**
     * Whether the request contains a Session object.
     *
     * This method does not give any information about the state of the session object,
     * like whether the session is started or not. It is just a way to check if this Request
     * is associated with a Session instance.
     *
     * @returns {boolean} true when the Request contains a Session object, false otherwise
     */
    hasSession() {
        return !! this._session;
    }

    /**
     * Returns the client IP addresses.
     *
     * In the returned array the most trusted IP address is first, and the
     * least trusted one last. The "real" client IP address is the last one,
     * but this is also the least trusted one. Trusted proxies are stripped.
     *
     * Use this method carefully; you should use getClientIp() instead.
     *
     * @returns {string[]} The client IP addresses
     *
     * @private
     *
     * @see getClientIp()
     */
    _getClientIps() {
        const ip = this.server.get('REMOTE_ADDR');
        if (! this.isFromTrustedProxy) {
            return [ ip ];
        }

        const forwarded = this._getTrustedValues(Request.HEADER_X_FORWARDED_FOR, ip);

        return 0 < forwarded.length ? forwarded : [ ip ];
    }

    /**
     * Returns an array of trusted forwarded values
     *
     * @param {int} type
     * @param {undefined|string} [ip]
     *
     * @returns {string[]}
     *
     * @private
     */
    _getTrustedValues(type, ip = undefined) {
        let clientValues = [];
        let forwardedValues = [];

        if (_trustedHeaders[type] && this.headers.has(_trustedHeaders[type])) {
            for (const v of this.headers.get(_trustedHeaders[type]).split(',')) {
                clientValues.push((__self.HEADER_X_FORWARDED_PORT === type ? '0.0.0.0:' : '') + __jymfony.trim(v));
            }
        }

        if (_trustedHeaders[__self.HEADER_FORWARDED] && this.headers.has(_trustedHeaders[__self.HEADER_FORWARDED])) {
            forwardedValues = this.headers.get(_trustedHeaders[__self.HEADER_FORWARDED]);

            const regex = new RegExp(__jymfony.sprintf('{(?:%s)=(?:"?\\[?)([a-zA-Z0-9\\.:_\\-/]*)}', _forwardedParams[type]), 'g');
            const matches = forwardedValues.match(regex);
            forwardedValues = matches ? [ matches[1] ] : [];
        }

        if (undefined !== ip) {
            clientValues = this._normalizeAndFilterClientIps(clientValues, ip);
            forwardedValues = this._normalizeAndFilterClientIps(forwardedValues, ip);
        }

        if (forwardedValues === clientValues || 0 === clientValues.length) {
            return forwardedValues;
        }

        if (0 === forwardedValues.length) {
            return clientValues;
        }

        if (! this.isForwardedValid) {
            return undefined !== ip ? [ '0.0.0.0', ip ] : [];
        }

        this.isForwardedValid = false;

        throw new ConflictingHeadersException(__jymfony.sprintf('The request has both a trusted "%s" header and a trusted "%s" header, conflicting with each other. You should either configure your proxy to remove one of them, or configure your project to distrust the offending one.', _trustedHeaders[__self.HEADER_FORWARDED], _trustedHeaders[type]));
    }

    /**
     *
     * @param {string[]} clientIps
     * @param {string} ip
     *
     * @returns {*}
     *
     * @private
     */
    _normalizeAndFilterClientIps(clientIps, ip) {
        if (0 === clientIps.length) {
            return [];
        }

        clientIps = [ ...clientIps, ip ];
        let firstTrustedIp = undefined;

        for (let [ key, clientIp ] of __jymfony.getEntries(clientIps)) {
            // Remove port (unfortunately, it does happen)
            const match = clientIp.match(/((?:d+.){3}d+):d+/);
            if (match) {
                clientIps[key] = clientIp = match[1];
            }

            if (0 === isIP(clientIp)) {
                delete clientIps[key];

                continue;
            }

            if (Ip.check(clientIp, _trustedProxies)) {
                delete clientIps[key];

                // Fallback to this when the client IP falls into the range of trusted proxies
                if (undefined === firstTrustedIp) {
                    firstTrustedIp = clientIp;
                }
            }
        }

        clientIps = clientIps.filter(v => !! v);

        // Now the IP chain contains only untrusted proxies and the client IP
        return 0 < clientIps.length ? clientIps.reverse() : [ firstTrustedIp ];
    }
}

Request.METHOD_HEAD = 'HEAD';
Request.METHOD_GET = 'GET';
Request.METHOD_POST = 'POST';
Request.METHOD_PUT = 'PUT';
Request.METHOD_PATCH = 'PATCH';
Request.METHOD_DELETE = 'DELETE';
Request.METHOD_PURGE = 'PURGE';
Request.METHOD_OPTIONS = 'OPTIONS';
Request.METHOD_TRACE = 'TRACE';
Request.METHOD_CONNECT = 'CONNECT';

Request.HEADER_FORWARDED = 0b00001; // When using RFC 7239
Request.HEADER_X_FORWARDED_FOR = 0b00010;
Request.HEADER_X_FORWARDED_HOST = 0b00100;
Request.HEADER_X_FORWARDED_PROTO = 0b01000;
Request.HEADER_X_FORWARDED_PORT = 0b10000;
Request.HEADER_X_FORWARDED_ALL = 0b11110; // All "X-Forwarded-*" headers
Request.HEADER_X_FORWARDED_AWS_ELB = 0b11010; // AWS ELB doesn't send X-Forwarded-Host

Request.ATTRIBUTE_PARENT_REQUEST = '_parent_request';

/**
 * Names for headers that can be trusted when
 * using trusted proxies.
 *
 * The FORWARDED header is the standard as of rfc7239.
 *
 * The other headers are non-standard, but widely used
 * by popular reverse proxies (like Apache mod_proxy or Amazon EC2).
 */

_trustedHeaders[Request.HEADER_FORWARDED] = 'FORWARDED';
_trustedHeaders[Request.HEADER_X_FORWARDED_FOR] = 'X_FORWARDED_FOR';
_trustedHeaders[Request.HEADER_X_FORWARDED_HOST] = 'X_FORWARDED_HOST';
_trustedHeaders[Request.HEADER_X_FORWARDED_PROTO] = 'X_FORWARDED_PROTO';
_trustedHeaders[Request.HEADER_X_FORWARDED_PORT] = 'X_FORWARDED_PORT';

_forwardedParams[Request.HEADER_X_FORWARDED_FOR] = 'for';
_forwardedParams[Request.HEADER_X_FORWARDED_HOST] = 'host';
_forwardedParams[Request.HEADER_X_FORWARDED_PROTO] = 'proto';
_forwardedParams[Request.HEADER_X_FORWARDED_PORT] = 'host';
