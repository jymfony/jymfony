const GenericRetryStrategy = Jymfony.Component.HttpClient.Retry.GenericRetryStrategy;
const MockHttpClient = Jymfony.Component.HttpClient.MockHttpClient;
const MockResponse = Jymfony.Component.HttpClient.Response.MockResponse;
const RetryableHttpClient = Jymfony.Component.HttpClient.RetryableHttpClient;
const ServerException = Jymfony.Contracts.HttpClient.Exception.ServerException;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class RetryableHttpClientTest extends TestCase {
    async testRetryOnError() {
        const client = new RetryableHttpClient(
            new MockHttpClient([
                new MockResponse('', { http_code: 500 }),
                new MockResponse('', { http_code: 200 }),
            ]),
            new GenericRetryStrategy({ 500: true }, 0),
            1
        );

        const response = client.request('GET', 'http://example.com/foo-bar');

        __self.assertSame(200, await response.getStatusCode());
    }

    async testRetryRespectStrategy() {
        const client = new RetryableHttpClient(
            new MockHttpClient([
                new MockResponse('', { http_code: 500 }),
                new MockResponse('', { http_code: 500 }),
                new MockResponse('', { http_code: 200 }),
            ]),
            new GenericRetryStrategy({ 500: true }, 0),
            1
        );

        const response = client.request('GET', 'http://example.com/foo-bar');

        this.expectException(ServerException);
        await response.getHeaders();
    }

    async testRetryWithBody() {
        const client = new RetryableHttpClient(
            new MockHttpClient([
                new MockResponse('', { http_code: 500 }),
                new MockResponse('', { http_code: 200 }),
            ]),
            new (class extends GenericRetryStrategy {
                shouldRetry(responseInfo, responseContent) {
                    return null === responseContent ? null : 200 !== responseInfo.http_code;
                }
            })(GenericRetryStrategy.DEFAULT_RETRY_STATUS_CODES, 0),
            1
        );

        const response = client.request('GET', 'http://example.com/foo-bar');

        __self.assertSame(200, await response.getStatusCode());
    }

    async testRetryWithBodyKeepContent() {
        const client = new RetryableHttpClient(
            new MockHttpClient([
                new MockResponse('my bad', { http_code: 400 }),
            ]),
            new (class extends GenericRetryStrategy {
                shouldRetry(responseInfo, responseContent) {
                    if (null === responseContent) {
                        return null;
                    }

                    return 'my bad' !== responseContent.toString();
                }
            })({ 400: true }, 0),
            1
        );

        const response = client.request('GET', 'http://example.com/foo-bar');

        __self.assertSame(400, await response.getStatusCode());
        __self.assertSame('my bad', (await response.getContent(false)).toString());
    }

    async testRetryWithBodyInvalid() {
        const client = new RetryableHttpClient(
            new MockHttpClient([
                new MockResponse('', { http_code: 500 }),
                new MockResponse('', { http_code: 200 }),
            ]),
            new (class extends GenericRetryStrategy {
                shouldRetry() {
                    return null;
                }
            })(GenericRetryStrategy.DEFAULT_RETRY_STATUS_CODES, 0),
            1
        );

        const response = client.request('GET', 'http://example.com/foo-bar');

        this.expectExceptionMessageRegex(/must not return null when called with a body/);
        await response.getHeaders();
    }
}
