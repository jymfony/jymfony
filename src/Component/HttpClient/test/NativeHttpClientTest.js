import { expect } from 'chai';

const HttpClientTestCase = Jymfony.Contracts.HttpClient.Test.HttpClientTestCase;
const NativeHttpClient = Jymfony.Component.HttpClient.NativeHttpClient;

export default class NativeHttpClientTest extends HttpClientTestCase {
    getHttpClient() {
        return new NativeHttpClient();
    }

    get testCaseName() {
        return '[HttpClient] ' + super.testCaseName;
    }

    async testHttpVersion() {
        const client = this.getHttpClient();
        const response = client.request('GET', 'http://localhost:8057', {
            http_version: '1.0',
        });

        expect(await response.getStatusCode()).to.be.equal(200);

        const body = await response.getDecodedContent();
        expect(body.server.SERVER_PROTOCOL).to.be.equal('HTTP/1.1'); // Native http client does not really support HTTP/1.0
        expect(body.server.REQUEST_METHOD).to.be.equal('GET');
    }
}
