const HttpClientInterface = Jymfony.Contracts.HttpClient.HttpClientInterface;
const HttpClientTrait = Jymfony.Component.HttpClient.HttpClientTrait;
const MockResponse = Jymfony.Component.HttpClient.Response.MockResponse;
const ResponseInterface = Jymfony.Contracts.HttpClient.ResponseInterface;
const TransportException = Jymfony.Contracts.HttpClient.Exception.TransportException;

/**
 * A test-friendly HttpClient that doesn't make actual HTTP requests.
 *
 * @memberOf Jymfony.Component.HttpClient
 */
export default class MockHttpClient extends implementationOf(HttpClientInterface, HttpClientTrait) {
    /**
     * @param {GeneratorFunction|GeneratorFunction[]|Jymfony.Contracts.HttpClient.ResponseInterface|Jymfony.Contracts.HttpClient.ResponseInterface[]|IterableIterator|null} responseFactory
     * @param {string} baseUri
     */
    __construct(responseFactory = null, baseUri = null) {
        if (responseFactory instanceof ResponseInterface) {
            responseFactory = [ responseFactory ];
        }

        if (null !== responseFactory) {
            if (isGeneratorFunction(responseFactory)) {
                responseFactory = responseFactory();
            } else if (! isFunction(responseFactory) && undefined !== responseFactory[Symbol.iterator]) {
                const factory = responseFactory;
                responseFactory = (function * () {
                    yield * factory;
                }());
            }
        }

        this._responseFactory = responseFactory;
        this._baseUri = baseUri;
        this._requestsCount = 0;
    }

    /**
     * @inheritdoc
     */
    request(method, url, options = {}) {
        [ url, options ] = this._prepareRequest(method, url, options, { base_uri: this._baseUri, buffer: true }, true);

        let response;
        if (null === this._responseFactory) {
            response = new MockResponse();
        } else if (isFunction(this._responseFactory)) {
            response = (this._responseFactory)(method, url, options);
        } else {
            const { value: responseFactory, done } = this._responseFactory.next();
            if (done) {
                throw new TransportException('The response factory iterator passed to MockHttpClient is empty.');
            }

            response = isFunction(responseFactory) ? responseFactory(method, url, options) : responseFactory;
        }

        ++this._requestsCount;

        if (! (response instanceof ResponseInterface)) {
            throw new TransportException(__jymfony.sprintf('The response factory passed to MockHttpClient must return/yield an instance of ResponseInterface, "%s" given.', __jymfony.get_debug_type(response)));
        }

        return MockResponse.fromRequest(method, url, options, response);
    }

    get requestsCount() {
        return this._requestsCount;
    }
}
