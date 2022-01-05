const HttpClientTestCase = Jymfony.Contracts.HttpClient.Test.HttpClientTestCase;
const NativeHttpClient = Jymfony.Component.HttpClient.NativeHttpClient;

export default class NativeHttpClientTest extends HttpClientTestCase {
    beforeEach() {
        if (!! process.env.GITHUB_WORKFLOW && __jymfony.Platform.isWindows()) { // Tests on windows are too unstable on GHA
            this.markTestSkipped();
        }
    }

    getHttpClient() {
        return new NativeHttpClient();
    }

    get retries() {
        return 3;
    }

    get testCaseName() {
        return '[HttpClient] ' + super.testCaseName;
    }

    async testHttpVersion() {
        if (__jymfony.Platform.isWindows()) {
            this.markTestSkipped();
        }

        const client = this.getHttpClient();
        const response = client.request('GET', 'http://localhost:8057', {
            http_version: '1.0',
        });

        __self.assertEquals(200, await response.getStatusCode());

        const body = await response.getDecodedContent();
        __self.assertEquals('HTTP/1.1', body.server.SERVER_PROTOCOL); // Native http client does not really support HTTP/1.0
        __self.assertEquals('GET', body.server.REQUEST_METHOD);
    }
}
