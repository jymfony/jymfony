const DecodingException = Jymfony.Contracts.HttpClient.Exception.DecodingException;
const MockResponse = Jymfony.Component.HttpClient.Response.MockResponse;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class MockResponseTest extends TestCase {
    get testCaseName() {
        return '[HttpClient] ' + super.testCaseName;
    }

    async testToArray() {
        const data = { color: 'orange', size: 42 };
        let response = new MockResponse(JSON.stringify(data), {
            response_headers: [
                'Content-Type: application/json',
            ],
        });

        response = MockResponse.fromRequest('GET', 'https://example.com/file.json', {}, response);
        __self.assertSame(data, await response.getDecodedContent());
    }

    @dataProvider('toArrayErrors')
    async testToArrayError(content, responseHeaders, message) {
        this.expectException(DecodingException);
        this.expectExceptionMessage(message);

        let response = new MockResponse(content, { response_headers: responseHeaders });
        response = MockResponse.fromRequest('GET', 'https://example.com/file.json', {}, response);
        await response.getDecodedContent();
    }

    async testUrlHttpMethodMockResponse() {
        const responseMock = new MockResponse(JSON.stringify({ foo: 'bar' }));
        const url = 'https://example.com/some-endpoint';
        const response = MockResponse.fromRequest('GET', url, {}, responseMock);

        __self.assertSame('GET', response.getInfo('http_method'));
        __self.assertSame('GET', responseMock.requestMethod);

        __self.assertSame(url, response.getInfo('url'));
        __self.assertSame(url, responseMock.requestUrl);
    }

    * toArrayErrors() {
        const node19 = __jymfony.version_compare(process.versions.node, '19', '>=');
        const headers = [ 'Content-Type: application/json' ];

        yield [ '', headers, 'Response body is empty.' ];
        yield [ 'not json', headers, node19 ? 'Cannot decode content: Unexpected token \'o\', "not json" is not valid JSON' : 'Cannot decode content: Unexpected token o in JSON at position 1' ];
        yield [ '[1,2}', headers, node19 ? 'Cannot decode content: Expected \',\' or \']\' after array element in JSON at position 4' : 'Cannot decode content: Unexpected token } in JSON at position 4' ];
        yield [ '"not an array"', headers, 'JSON content was expected to decode to an array, "string" returned for "https://example.com/file.json".' ];
        yield [ '8', headers, 'JSON content was expected to decode to an array, "int" returned for "https://example.com/file.json".' ];
    }
}
