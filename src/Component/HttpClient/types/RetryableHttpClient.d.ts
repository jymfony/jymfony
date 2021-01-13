declare namespace Jymfony.Component.HttpClient {
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
    import HttpClientInterface = Jymfony.Contracts.HttpClient.HttpClientInterface;
    import HttpClientRequestOptions = Jymfony.Contracts.HttpClient.HttpClientRequestOptions;
    import ResponseInterface = Jymfony.Contracts.HttpClient.ResponseInterface;
    import RetryStrategyInterface = Jymfony.Component.HttpClient.Retry.RetryStrategyInterface;

    /**
     * Automatically retries failing HTTP requests.
     */
    export class RetryableHttpClient extends implementationOf(HttpClientInterface) {
        private _client: HttpClientInterface;
        private _strategy: RetryStrategyInterface;
        private _maxRetries: number;
        private _logger: LoggerInterface;

        /**
         * Constructor.
         *
         * @param client The Http client to decorate
         * @param strategy The retry strategy to use in case of error.
         * @param maxRetries The maximum number of times to retry
         * @param logger
         */
        __construct(client: HttpClientInterface, strategy?: RetryStrategyInterface, maxRetries?: number, logger?: LoggerInterface): void;
        constructor(client: HttpClientInterface, strategy?: RetryStrategyInterface, maxRetries?: number, logger?: LoggerInterface);

        /**
         * @inheritdoc
         */
        request(method: string, url: string, options?: HttpClientRequestOptions): ResponseInterface;

        private _getDelayFromHeader(headers: Record<string, string[]>): number | null;
    }
}
