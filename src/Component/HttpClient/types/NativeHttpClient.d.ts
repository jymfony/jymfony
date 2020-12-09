declare namespace Jymfony.Component.HttpClient {
    import ResponseInterface = Jymfony.Contracts.HttpClient.ResponseInterface;
    import HttpClientInterface = Jymfony.Contracts.HttpClient.HttpClientInterface;
    import HttpClientRequestOptions = Jymfony.Contracts.HttpClient.HttpClientRequestOptions;
    import HttpClientTrait = Jymfony.Component.HttpClient.HttpClientTrait;
    import LoggerAwareInterface = Jymfony.Contracts.Logger.LoggerAwareInterface;
    import LoggerAwareTrait = Jymfony.Contracts.Logger.LoggerAwareTrait;

    export class NativeHttpClient extends implementationOf(
        HttpClientInterface, HttpClientTrait, LoggerAwareInterface, LoggerAwareTrait
    ) {
        __construct(defaultOptions?: HttpClientRequestOptions): void;

        /**
         * @inheritDoc
         *
         * @throws {Jymfony.Contracts.HttpClient.Exception.TransportException} When an unsupported option is passed
         */
        request(method: string, url: string | URL, options?: HttpClientRequestOptions): ResponseInterface;
    }
}
