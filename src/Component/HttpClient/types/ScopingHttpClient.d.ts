declare namespace Jymfony.Component.HttpClient {
    import HttpClientInterface = Jymfony.Contracts.HttpClient.HttpClientInterface;
    import HttpClientRequestOptions = Jymfony.Contracts.HttpClient.HttpClientRequestOptions;
    import HttpClientTrait = Jymfony.Component.HttpClient.HttpClientTrait;
    import LoggerAwareInterface = Jymfony.Contracts.Logger.LoggerAwareInterface;
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
    import ResponseInterface = Jymfony.Contracts.HttpClient.ResponseInterface;

    /**
     * Auto-configure the default options based on the requested URL.
     */
    export class ScopingHttpClient extends implementationOf(HttpClientInterface, LoggerAwareInterface, HttpClientTrait) {
        private _client: HttpClientInterface;
        private _defaultOptionsByRegexp: Record<string, any>;
        private _defaultRegexp: string;

        /**
         * Constructor.
         */
        __construct(client: HttpClientInterface, defaultOptionsByRegexp: Record<string, any>, defaultRegexp?: RegExp): void;
        constructor(client: HttpClientInterface, defaultOptionsByRegexp: Record<string, any>, defaultRegexp?: RegExp);

        static forBaseUri(client: HttpClientInterface, baseUri: string, defaultOptions?: HttpClientRequestOptions, regexp?: RegExp): ScopingHttpClient;

        /**
         * @inheritdoc
         */
        request(method: string, url: string, options?: HttpClientRequestOptions): ResponseInterface;

        /**
         * @inheritdoc
         */
        setLogger(logger: LoggerInterface): void;
    }
}
