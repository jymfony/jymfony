const MockHttpClient = Jymfony.Component.HttpClient.MockHttpClient;
const ScopingHttpClient = Jymfony.Component.HttpClient.ScopingHttpClient;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class ScopingHttpClientTest extends TestCase {
    get testCaseName() {
        return '[HttpClient] ' + super.testCaseName;
    }

    testRelativeUrl() {
        const mockClient = new MockHttpClient();
        const client = new ScopingHttpClient(mockClient, []);

        this.expectException(InvalidArgumentException);
        client.request('GET', '/foo');
    }

    async testRelativeUrlWithDefaultRegexp() {
        const mockClient = new MockHttpClient();
        const client = new ScopingHttpClient(mockClient, { '.*': { base_uri: 'http://example.com' } }, /.*/);

        const response = client.request('GET', '/foo');
        __self.assertSame('http://example.com/foo', response.getInfo('url'));
    }

    @dataProvider('provideMatchingUrls')
    async testMatchingUrls(regexp, url, options) {
        const mockClient = new MockHttpClient();
        const client = new ScopingHttpClient(mockClient, options);

        const response = client.request('GET', url);
        const requestedOptions = response.requestOptions;

        __self.assertSame(options[regexp]['case'], requestedOptions['case']);
    }

    * provideMatchingUrls() {
        const defaultOptions = {
            '.*/foo-bar': { 'case': 1 },
            '.*': { 'case': 2 },
        };

        yield [ '.*/foo-bar', 'http://example.com/foo-bar', defaultOptions ];
        yield [ '.*', 'http://example.com/bar-foo', defaultOptions ];
        yield [ '.*', 'http://example.com/foobar', defaultOptions ];
    }

    async testMatchingUrlsAndOptions() {
        const defaultOptions = {
            '.*/foo-bar': { headers: { 'X-FooBar': 'unit-test-foo-bar' } },
            '.*': { headers: { 'Content-Type': 'text/html' } },
        };

        const mockClient = new MockHttpClient();
        const client = new ScopingHttpClient(mockClient, defaultOptions);

        let response = client.request('GET', 'http://example.com/foo-bar', { json: { url: 'http://example.com' } });
        let requestOptions = response.requestOptions;
        __self.assertSame('Content-Type: application/json', requestOptions.headers[1]);

        const requestJson = JSON.parse(requestOptions.body.buffer.toString());
        __self.assertSame('http://example.com', requestJson.url);
        __self.assertSame('X-FooBar: ' + defaultOptions['.*/foo-bar'].headers['X-FooBar'], requestOptions.headers[0]);

        response = client.request('GET', 'http://example.com/bar-foo', { headers: { 'X-FooBar': 'unit-test' } });
        requestOptions = response.requestOptions;
        __self.assertSame('X-FooBar: unit-test', requestOptions.headers[0]);
        __self.assertSame('Content-Type: text/html', requestOptions.headers[1]);

        response = client.request('GET', 'http://example.com/foobar-foo', { headers: { 'X-FooBar': 'unit-test' } });
        requestOptions = response.requestOptions;
        __self.assertSame('X-FooBar: unit-test', requestOptions.headers[0]);
        __self.assertSame('Content-Type: text/html', requestOptions.headers[1]);
    }

    async testForBaseUri() {
        const client = ScopingHttpClient.forBaseUri(new MockHttpClient(), 'http://example.com/foo');

        let response = client.request('GET', '/bar');
        __self.assertSame('http://example.com/foo', response.requestOptions.base_uri);
        __self.assertSame('http://example.com/bar', response.getInfo('url'));

        response = client.request('GET', 'http://foo.bar/');
        __self.assertNull(response.requestOptions.base_uri);
    }
}
