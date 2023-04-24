declare namespace Jymfony.Component.HttpClient {
    import HttpClientInterface = Jymfony.Contracts.HttpClient.HttpClientInterface;
    import HttpClientRequestOptions = Jymfony.Contracts.HttpClient.HttpClientRequestOptions;

    /**
     * A factory to instantiate the best possible HTTP client for the runtime.
     *
     * @final
     */
    export class HttpClient {
        /**
         * @param {*} defaultOptions     Default request's options
         *
         * @see {HttpClientInterface.OPTIONS_DEFAULTS} for available options
         */
        static create(defaultOptions?: HttpClientRequestOptions): HttpClientInterface;

        /**
         * Creates a client that adds options (e.g. authentication headers) only when the request URL matches the provided base URI.
         */
        static createForBaseUri(baseUri: string, defaultOptions?: HttpClientRequestOptions): ScopingHttpClient;
    }
}
