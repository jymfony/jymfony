import * as zlib from 'zlib';
import { promises as dnsPromises } from 'dns';
import { performance } from 'perf_hooks';

const HttpClientInterface = Jymfony.Contracts.HttpClient.HttpClientInterface;
const HttpClientTrait = Jymfony.Component.HttpClient.HttpClientTrait;
const LoggerAwareInterface = Jymfony.Contracts.Logger.LoggerAwareInterface;
const LoggerAwareTrait = Jymfony.Contracts.Logger.LoggerAwareTrait;
const NativeHttpResponse = Jymfony.Component.HttpClient.Response.NativeHttpResponse;
const TransportException = Jymfony.Contracts.HttpClient.Exception.TransportException;

const { Resolver, lookup } = dnsPromises;

/**
 * Extracts the host and the port from the URL.
 *
 * @param {URL} url
 * @param {Object.<string, *>} info
 *
 * @returns {[string, string]}
 */
const parseHostPort = (url, info) => {
    let port = (new URL(url.origin)).port;
    if (port) {
        info.primary_port = port;
        port = ':' + port;
    } else {
        info.primary_port = 'http:' === url.protocol ? 80 : 443;
    }

    return [ (new URL(url.origin)).hostname, port ];
};

/**
 * Adds correct proxy-headers and options to the context object.
 *
 * @param context
 * @param host
 * @param requestHeaders
 * @param proxy
 * @param isSsl
 *
 * @returns {boolean}
 */
const configureHeadersAndProxy = (context, host, requestHeaders, proxy, isSsl) => {
    if (! proxy) {
        context.http.headers = requestHeaders;
        context.ssl.peer_name = host;

        return false;
    }

    // Matching "no_proxy" should follow the behavior of curl

    for (const rule of proxy.no_proxy) {
        const dotRule = '.' + __jymfony.ltrim(rule, '.');

        if ('*' === rule || host === rule || host.substr(host.length - dotRule.length) === dotRule) {
            context.http.proxy = null;
            context.http.request_fulluri = false;
            context.http.headers = requestHeaders;
            context.ssl.peer_name = host;

            return false;
        }
    }

    if (null !== proxy.auth) {
        requestHeaders.push('Proxy-Authorization: ' + proxy.auth);
    }

    context.http.proxy = proxy.url;
    context.http.request_fulluri = ! isSsl;
    context.http.headers = requestHeaders;
    context.ssl.peer_name = null;

    return true;
};

/**
 * Resolves the IP of the host using the local DNS cache if possible.
 */
const dnsResolve = async (host, context, info, onProgress) => {
    let ips = context.dnsCache[host] || null;
    if (null === ips) {
        info.debug += '* Hostname was NOT found in DNS cache\n';
        const now = performance.now();

        const resolve = async (host) => {
            if (context.dnsResolver) {
                return [
                    ...(await context.dnsResolver.resolve4(host)),
                    ...(await context.dnsResolver.resolve6(host)),
                ];
            }

            return (await lookup(host, { all: true, verbatim: true }))
                .map(address => address.address);
        };

        try {
            ips = await resolve(host);
        } catch (e) {
            throw new TransportException(__jymfony.sprintf('Could not resolve host "%s": %s', host, e.message), null, e);
        }

        if (0 === ips.length) {
            throw new TransportException(__jymfony.sprintf('Could not resolve host "%s".', host));
        }

        info.namelookup_time = performance.now() - (info.start_time || now);
        context.dnsCache[host] = ips;

        ips.forEach(ip => info.debug += '* Added ' + host + ':0:' + ip + ' to DNS cache\n');
    } else {
        info.debug += '* Hostname was found in DNS cache\n';
    }

    info.primary_ip = ips[0];
    context.ips = ips;

    if (onProgress) {
        // Notify DNS resolution
        onProgress();
    }

    return ips[0];
};

/**
 * @memberOf Jymfony.Component.HttpClient
 */
export default class NativeHttpClient extends implementationOf(
    HttpClientInterface, HttpClientTrait, LoggerAwareInterface, LoggerAwareTrait
) {
    __construct(defaultOptions = {}) {
        super.__construct();

        this._defaultOptions = HttpClientInterface.OPTIONS_DEFAULTS;
        const buffer = this._defaultOptions.buffer;
        this._defaultOptions.buffer = null !== buffer && undefined !== buffer ? buffer : NativeHttpClient._shouldBuffer;

        if (defaultOptions) {
            /**
             * @type {Object.<string, *>}
             *
             * @private
             */
            this._defaultOptions = this._prepareRequest(null, null, defaultOptions, this._defaultOptions)[1];
        }
    }

    /**
     * @inheritDoc
     *
     * @param {string} method
     * @param {string|URL} url
     * @param {Object.<string, *>} options
     *
     * @returns {Jymfony.Contracts.HttpClient.ResponseInterface}
     *
     * @throws {Jymfony.Contracts.HttpClient.Exception.TransportException} When an unsupported option is passed
     */
    request(method, url, options = {}) {
        [ url, options ] = this._prepareRequest(method, String(url), options, this._defaultOptions);

        if (! options.normalized_headers['accept-encoding']) {
            const encodings = [ 'gzip', 'deflate' ];
            if (undefined !== zlib.createBrotliCompress) {
                encodings.unshift('br');
            }

            options.headers.push('Accept-Encoding: ' + encodings.join(', '));
        }

        url = new URL(url);
        const info = {
            response_headers: {},
            url: String(url),
            error: null,
            canceled: false,
            http_method: method,
            http_code: 0,
            redirect_count: 0,
            start_time: 0.0,
            connect_time: 0.0,
            redirect_time: 0.0,
            pretransfer_time: 0.0,
            starttransfer_time: 0.0,
            total_time: 0.0,
            namelookup_time: 0.0,
            size_upload: 0,
            size_download: 0,
            size_body: options.body ? options.body.size : null,
            primary_ip: '',
            primary_port: 'http:' === url.protocol ? 80 : 443,
            debug: '',
            user_data: options.user_data,
        };

        let onProgress = options.on_progress;
        if (onProgress) {
            // Memoize the last progress to ease calling the callback periodically when no network transfer happens
            let lastProgress = [ 0, 0 ];
            const maxDuration = 0 < options.max_duration ? options.max_duration : Infinity;
            onProgress = (...progress) => {
                if (info.total_time >= maxDuration) {
                    throw new TransportException(__jymfony.sprintf('Max duration was reached for "%s".', String(info.url)));
                }

                const progressInfo = { ...info };
                progressInfo.url = String(progressInfo.url);
                delete progressInfo.size_body;

                if (progress && -1 === progress[0]) {
                    // Response completed
                    lastProgress[0] = Math.max(...lastProgress);
                } else {
                    lastProgress = progress || lastProgress;
                }

                options.on_progress(lastProgress[0], lastProgress[1], progressInfo);
            };
        } else if (0 < options.max_duration) {
            const maxDuration = options.max_duration;
            onProgress = () => {
                if (info.total_time >= maxDuration) {
                    throw new TransportException(__jymfony.sprintf('Max duration was reached for "%s".', String(info.url)));
                }
            };
        }

        if (this._logger) {
            this._logger.info(__jymfony.sprintf('Request: "%s %s"', method, String(url)));
        }

        if (!! options.normalized_headers['user-agent']) {
            options.headers.push('User-Agent: Jymfony HttpClient/Native');
        }

        if (0 < options.max_duration) {
            options.timeout = Math.min(options.max_duration, options.timeout);
        }

        let dnsResolver = null;
        if (options.resolvers && 0 < options.resolvers.length) {
            dnsResolver = new Resolver();
            dnsResolver.setServers(options.resolvers);
        }

        const protocolVersion = options.http_version || ('https:' !== url.protocol ? '1.1' : '2');
        const context = {
            http: {
                protocol_version: protocolVersion,
                method,
                url: String(url),
                content: options.body,
                timeout: options.timeout,
                headers: null,
                proxy: null,
            },
            ssl: {
                ca: options.ca_file,
                cert: options.local_cert,
                private_key: options.local_pk,
                passphrase: options.passphrase,
                ciphers: options.ciphers,
            },
            socket: {
                bind_to: options.bind_to || '0:0',
                tcp_nodelay: true,
            },
            dnsCache: {},
            dnsResolver,
        };

        if (options.resolve) {
            Object.assign(context.dnsCache, options.resolve);
            for (const [ domain, ips ] of __jymfony.getEntries(context.dnsCache)) {
                if (! isArray(ips)) {
                    context.dnsCache[domain] = [ ips ];
                }
            }
        }

        const resolver = async () => {
            const [ host, port ] = parseHostPort(url, info);

            if (! options.normalized_headers.host) {
                options.headers.push('Host: ' + host + port);
            }

            const proxy = this._getProxy(options.proxy, url, options.no_proxy);
            if (! configureHeadersAndProxy(context, host, options.headers, proxy, 'https:' === url.protocol)) {
                url.host = await dnsResolve(host, context, info, onProgress);
                url.port = null;
            } else {
                await dnsResolve(proxy.hostname, context, info, onProgress);
            }

            return [ this._createRedirectResolver(options, host, proxy, info, onProgress), url, host ];
        };

        if ('' !== url.username && ! options.normalized_headers['authorization']) {
            const auth = decodeURIComponent(url.username) + (url.password ? ':' + decodeURIComponent(url.password) : '');
            options.headers.push('Authorization: Basic ' + Buffer.from(auth).toString('base64'));
        }

        return new NativeHttpResponse(url, options, info, context, resolver, onProgress);
    }

    /**
     * Handles redirects - the native logic is too buggy to be used.
     *
     * @param {Object.<string, *>} options
     * @param {string} host
     * @param {[string, string]|null} proxy
     * @param {Object.<string, *>} info
     * @param {Function|null} onProgress
     *
     * @returns {function(location: string, context: Object.<string, *>): Promise<URL>}
     *
     * @private
     */
    _createRedirectResolver(options, host, proxy, info, onProgress) {
        let redirectHeaders = {};
        const maxRedirects = options.max_redirects;
        if (0 < maxRedirects) {
            redirectHeaders = { host };
            redirectHeaders.with_auth = options.headers.filter(h => ! h.startsWith('Host:'));
            redirectHeaders.no_auth = [ ...redirectHeaders.with_auth ];

            if (!! options.normalized_headers.authorization || !! options.normalized_headers.cookie) {
                redirectHeaders.no_auth = redirectHeaders.no_auth.filter(h => ! h.startsWith('Authorization:') && ! h.startsWith('Cookie:'));
            }
        }

        return async (location, context) => {
            if (! location || 300 > info.http_code || 400 <= info.http_code) {
                info['redirect_url'] = null;

                return null;
            }

            let url;
            try {
                url = this._parseUrl(location, undefined, undefined, context.http.url);
            } catch (e) {
                if (! (e instanceof InvalidArgumentException)) {
                    throw e;
                }

                info.redirect_url = null;

                return null;
            }

            url = this._resolveUrl(url, String(info.url));
            info.redirect_url = String(url);

            if (info.redirect_count >= maxRedirects) {
                return null;
            }

            info.url = String(url);
            ++info.redirect_count;
            info.redirect_time = performance.now() - info.start_time;

            // Do like curl and browsers: turn POST to GET on 301, 302 and 303
            if ([ 301, 302, 303 ].includes(info.http_code)) {
                if ('POST' === context.method || 303 === info.http_code) {
                    info.http_method = context.method = 'HEAD' === context.method ? 'HEAD' : 'GET';

                    context.content = '';
                    options.headers = options.headers.filter(h => ! h.match(! /content-(length|type):/i));
                    context.http.headers = options.headers;
                }
            }

            const [ host, port ] = parseHostPort(url, info);

            // Authorization and Cookie headers MUST NOT follow except for the initial host name
            const requestHeaders = redirectHeaders.host === host ? redirectHeaders.with_auth : redirectHeaders.no_auth;
            requestHeaders.push('Host: ' + host + port);

            const shouldResolve = ! configureHeadersAndProxy(context, host, requestHeaders, proxy, 'https:' === url.protocol) || undefined !== context.ssl.peer_name;
            if (shouldResolve) {
                url.host = await dnsResolve(host, context, info, onProgress);
                url.port = null;
            } else {
                await dnsResolve(proxy.hostname, context, info, onProgress);
            }

            return [ url, host ];
        };
    };
}
