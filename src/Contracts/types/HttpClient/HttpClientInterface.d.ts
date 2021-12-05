declare namespace Jymfony.Contracts.HttpClient {
    export type HttpClientBodyType = Record<string, string> | string | NodeJS.ReadableStream | Buffer;
    export type HttpClientRequestOptions = Partial<Nullable<{
        [key: string]: any;

        /**
         * An array containing the username as first value, and optionally the
         *   password as the second one; or string like username:password - enabling HTTP Basic
         *   authentication (RFC 7617)
         */
        auth_basic: string | [string, string],

        /**
         * A token enabling HTTP Bearer authorization (RFC 6750)
         */
        auth_bearer: string,

        /**
         * Object of query string values to merge with the request's URL
         */
        query: Record<string, string>,

        /**
         * Headers names provided as keys or as part of values
         */
        headers: Record<string, string | string[]>,

        /**
         * The callback SHOULD yield a string
         *   smaller than the amount requested as argument; the empty string signals EOF; if
         *   an object is passed, it is meant as a form payload of field names and values
         */
        body: HttpClientBodyType | (() => HttpClientBodyType),

        /**
         * If set, implementations MUST set the "body" option to the JSON-encoded
         *   value and set the "content-type" header to a JSON-compatible value if it is not
         *   explicitly defined in the headers option - typically "application/json"
         */
        json: any,

        /**
         * Any extra data to attach to the request (scalar, callable, object...) that
         *   MUST be available via $response->getInfo('user_data') - not used internally
         */
        user_data: any,

        /**
         * the maximum number of redirects to follow; a value lower than or equal to 0
         *   means redirects should not be followed; "Authorization" and "Cookie" headers MUST
         *   NOT follow except for the initial host name
         */
        max_redirects: number,

        /**
         * Defaults to the best supported version, typically 1.1 or 2.0
         */
        http_version: '1.0' | '1.1' | '2.0',

        /**
         * The URI to resolve relative URLs, following rules in RFC 3986, section 2
         */
        base_uri: string | URL,

        /**
         * Whether the content of the response should be buffered or not,
         *   or a writable stream where the response body should be written,
         *   or a closure telling if/where the response should be buffered based on its headers
         */
        buffer: boolean | NodeJS.WritableStream | Function,

        /**
         * Throwing any exceptions MUST abort
         *   the request; it MUST be called on DNS resolution, on arrival of headers and on
         *   completion; it SHOULD be called on upload/download of data and at least 1/s
         */
        on_progress: (dlNow: number, dlSize: number, info: HttpClientInfo) => void,

        /**
         * A map of host to IP address that SHOULD replace DNS resolution
         */
        resolve: Record<string, string>,

        /**
         * By default, the proxy-related env vars handled by curl SHOULD be honored
         */
        proxy: string,

        /**
         * A comma separated list of hosts that do not require a proxy to be reached
         */
        no_proxy: string,

        /**
         * The idle timeout - defaults to 60
         */
        timeout: number,

        /**
         * The maximum execution time for the request+response as a whole;
         *   a value lower than or equal to 0 means it is unlimited
         */
        max_duration: number,

        /**
         * The interface or the local socket to bind to
         */
        bind_to: string,

        /**
         * Require verification of SSL certificate used.
         */
        verify_peer: boolean,

        /**
         * Check the existence of a common name and also verify that it matches the hostname provided
         */
        verify_host: boolean,

        /**
         * Capture full certificate peer chain
         */
        capture_peer_cert_chain: boolean,

        /**
         * DNS resolver servers. Use system default if null or not passed.
         */
        resolvers: string[],
        ca_file: string,
        local_cert: string,
        local_pk: string,
        passphrase: string,
        ciphers: string,
    }>>;

    /**
     * Provides flexible methods for requesting HTTP resources asynchronously.
     */
    export class HttpClientInterface {
        public static readonly definition: Newable<HttpClientInterface>;
        public static OPTIONS_DEFAULTS: HttpClientRequestOptions;

        /**
         * Requests an HTTP resource.
         *
         * Responses MUST be lazy, but their status code MUST be
         * checked even if none of their public methods are called.
         *
         * Implementations are not required to support all options described above; they can also
         * support more custom options; but in any case, they MUST throw a TransportExceptionInterface
         * when an unsupported option is passed.
         *
         * @throws {Jymfony.Contracts.HttpClient.Exception.TransportException} When an unsupported option is passed
         */
        request(method: string, url: string, options?: HttpClientRequestOptions): ResponseInterface;
    }
}
