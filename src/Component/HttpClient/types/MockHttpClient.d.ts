declare namespace Jymfony.Component.HttpClient {
    import HttpClientInterface = Jymfony.Contracts.HttpClient.HttpClientInterface;
    import HttpClientRequestOptions = Jymfony.Contracts.HttpClient.HttpClientRequestOptions;
    import HttpClientTrait = Jymfony.Component.HttpClient.HttpClientTrait;
    import ResponseInterface = Jymfony.Contracts.HttpClient.ResponseInterface;

    /**
     * A test-friendly HttpClient that doesn't make actual HTTP requests.
     */
    export class MockHttpClient extends implementationOf(HttpClientInterface, HttpClientTrait) {
        private _responseFactory: IterableIterator<ResponseInterface> | null;
        private _baseUri: string;
        private _requestsCount: number;

        /**
         * Constructor.
         */
        __construct(responseFactory?: GeneratorFunction | GeneratorFunction[] | ResponseInterface | ResponseInterface[] | IterableIterator<ResponseInterface> | null, baseUri?: string): void;
        constructor(responseFactory?: GeneratorFunction | GeneratorFunction[] | ResponseInterface | ResponseInterface[] | IterableIterator<ResponseInterface> | null, baseUri?: string);

        /**
         * @inheritdoc
         */
        request(method: string, url: string, options?: HttpClientRequestOptions): ResponseInterface;

        get requestsCount(): number;
    }
}
