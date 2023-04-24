const NativeHttpClient = Jymfony.Component.HttpClient.NativeHttpClient;
const ScopingHttpClient = Jymfony.Component.HttpClient.ScopingHttpClient;

/**
 * A factory to instantiate the best possible HTTP client for the runtime.
 *
 * @memberOf Jymfony.Component.HttpClient
 * @final
 */
export default class HttpClient {
    /**
     * @param {*} defaultOptions     Default request's options
     *
     * @see {HttpClientInterface.OPTIONS_DEFAULTS} for available options
     */
    static create(defaultOptions = {}) {
        return new NativeHttpClient(defaultOptions);
    }

    /**
     * Creates a client that adds options (e.g. authentication headers) only when the request URL matches the provided base URI.
     */
    static createForBaseUri(baseUri, defaultOptions = {}) {
        const client = __self.create();

        return ScopingHttpClient.forBaseUri(client, baseUri, defaultOptions);
    }
}
