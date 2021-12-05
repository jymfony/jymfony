declare namespace Jymfony.Component.HttpClient {
    import HttpClientRequestOptions = Jymfony.Contracts.HttpClient.HttpClientRequestOptions;

    type ParsedUrl = Nullable<{
        scheme: string,
        authority: string,
        path: string,
        query: string,
        fragment: string,
    }>;

    type ResolvedProxy = {
        url: string,
        auth: string | null,
        no_proxy: string[],
    };

    /**
     * Provides the common logic from writing HttpClientInterface implementations.
     */
    export class HttpClientTrait {
        /**
         * @throws {InvalidArgumentException} When an invalid option is found
         */
        private _mergeDefaultOptions(options: Record<string, any>, defaultOptions: Record<string, any>, allowExtraOptions?: boolean): Record<string, any>;

        /**
         * Validates and normalizes method, URL and options, and merges them with defaults.
         *
         * @throws {InvalidArgumentException} When a not-supported option is found
         */
        private _prepareRequest(method: string | null, url: URL | string | null, options: HttpClientRequestOptions, defaultOptions?: HttpClientRequestOptions, allowExtraOptions?: boolean): [URL, HttpClientRequestOptions];

        private static _shouldBuffer(headers: Record<string, string[]>): boolean;

        /**
         * Parses a URL and fixes its encoding if needed.
         *
         * @throws {InvalidArgumentException} When an invalid URL is passed
         */
        private _parseUrl(url: string, query?: Record<string, string>, allowedSchemes?: Record<string, number>, baseUrl?: string): ParsedUrl;
        private static _parseUrl(url: string, query?: Record<string, string>, allowedSchemes?: Record<string, number>, baseUrl?: string): ParsedUrl;

        private _resolveUrl(url: ParsedUrl, baseUrl: string | URL | null, queryDefaults?: Record<string, string>): URL;
        private static _resolveUrl(url: ParsedUrl, baseUrl: string | URL | null, queryDefaults?: Record<string, string>): URL;

        /**
         * Loads proxy configuration from the same environment variables as curl when no proxy is explicitly set.
         */
        private _getProxy(proxy: null | string | URL, url: URL, noProxy: null | string): ResolvedProxy | null;
    }
}
