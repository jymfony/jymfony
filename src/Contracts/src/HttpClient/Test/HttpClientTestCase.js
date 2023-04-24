const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const TestHttpServer = Jymfony.Contracts.HttpClient.Test.TestHttpServer;
const ClientException = Jymfony.Contracts.HttpClient.Exception.ClientException;
const RedirectionException = Jymfony.Contracts.HttpClient.Exception.RedirectionException;
const TransportException = Jymfony.Contracts.HttpClient.Exception.TransportException;

/**
 * A reference test suite for HttpClientInterface implementations.
 *
 * @memberOf Jymfony.Contracts.HttpClient.Test
 * @abstract
 */
export default class HttpClientTestCase extends TestCase {
    async before() {
        __self.server = await TestHttpServer.start();
    }

    async after() {
        await __self.server.stop();
    }

    get defaultTimeout() {
        return 60000;
    }

    /**
     * @returns {Jymfony.Contracts.HttpClient.HttpClientInterface}
     * @abstract
     */
    getHttpClient() { }

    async testGetRequest() {
        const client = this.getHttpClient();
        const data = {}, response = client.request('GET', 'http://localhost:8057', {
            headers: { Foo: 'baR' },
            user_data: data,
        });

        __self.assertSame({}, await response.getInfo('response_headers'));
        __self.assertSame(data, await response.getInfo()['user_data']);
        __self.assertEquals(200, await response.getStatusCode());

        const info = response.getInfo();
        __self.assertEquals(null, info.error);
        __self.assertEquals(0, info.redirect_count);
        __self.assertEquals('localhost:8057', info.response_headers.host[0]);
        __self.assertEquals('http://localhost:8057/', info.url);

        const headers = await response.getHeaders();

        __self.assertEquals('localhost:8057', headers.host[0]);
        __self.assertEquals([ 'application/json' ], headers['content-type']);

        const body = JSON.parse((await response.getContent()).toString());
        __self.assertEquals(body, await response.getDecodedContent());

        __self.assertEquals('HTTP/1.1', body.server.SERVER_PROTOCOL);
        __self.assertEquals('http://localhost:8057/', body.uri);
        __self.assertEquals('GET', body.server.REQUEST_METHOD);
        __self.assertEquals('localhost:8057', body.headers.host[0]);
        __self.assertEquals('baR', body.headers.foo[0]);

        const broken = client.request('GET', 'http://localhost:8057/length-broken', {
            timeout: 1,
        });

        this.expectException(TransportException);
        await broken.getContent();
    }

    async testHeadRequest() {
        const client = this.getHttpClient();
        const data = {}, response = client.request('HEAD', 'http://localhost:8057/head', {
            headers: { Foo: 'baR' },
            user_data: data,
            buffer: true,
        });

        __self.assertEquals({}, response.getInfo('response_headers'));
        __self.assertEquals(200, await response.getStatusCode());

        const info = response.getInfo();
        __self.assertEquals('localhost:8057', info.response_headers.host[0]);

        const headers = await response.getHeaders();

        __self.assertEquals('localhost:8057', headers.host[0]);
        __self.assertEquals([ 'application/json' ], headers['content-type']);
        __self.assertGreaterThan(0, headers['content-length'][0]);

        __self.assertEquals('', (await response.getContent()).toString());
    }

    async testNonBufferedGetRequest() {
        const client = this.getHttpClient();
        const response = client.request('GET', 'http://localhost:8057/head', {
            headers: { Foo: 'baR' },
            buffer: true,
        });

        const body = await response.getDecodedContent();
        __self.assertEquals('baR', body.headers.foo[0]);

        this.expectException(TransportException);
        await response.getContent();
    }

    async testBufferSink() {
        const sink = new __jymfony.StreamBuffer();
        const client = this.getHttpClient();
        const response = client.request('GET', 'http://localhost:8057', {
            headers: { Foo: 'baR' },
            buffer: sink,
        });

        await response.getContent();

        const body = JSON.parse(sink.buffer.toString());
        __self.assertEquals('baR', body.headers.foo[0]);

        this.expectException(TransportException);
        await response.getDecodedContent();
    }

    async testConditionalBuffering() {
        const client = this.getHttpClient();
        let response = client.request('GET', 'http://localhost:8057');
        const firstContent = await response.getContent();
        const secondContent = await response.getContent();

        __self.assertEquals(firstContent, secondContent);

        response = await client.request('GET', 'http://localhost:8057', {
            buffer: function () {
                return false;
            },
        });

        const stream = new __jymfony.BlackHoleStream();
        const input = await response.getContent();
        await new Promise(async (res) => {
            input.on('end', res);
            input.pipe(stream);
        });

        try {
            await response.getContent();
            this.fail(ReflectionClass.getClassName(TransportException) + ' expected');
        } catch (e) {
            __self.assertInstanceOf(TransportException, e);
        }

        response.close();
    }

    async testReentrantBufferCallback() {
        const client = this.getHttpClient();
        const response = client.request('GET', 'http://localhost:8057', {
            buffer: function () {
                response.cancel();
                return true;
            },
        });

        __self.assertEquals(200, await response.getStatusCode());

        this.expectException(TransportException);
        await response.getContent();
    }

    async testThrowingBufferCallback() {
        const client = this.getHttpClient();
        const response = client.request('GET', 'http://localhost:8057', {
            buffer: function () {
                throw new Exception('Boo.');
            },
        });

        this.expectException(TransportException);
        this.expectExceptionMessage('Boo.');

        await response.getContent();
    }

    async testUnsupportedOption() {
        const client = this.getHttpClient();

        this.expectException(InvalidArgumentException);
        client.request('GET', 'http://localhost:8057', {
            capture_peer_cert: 1.0,
        });
    }

    async testHttpVersion() {
        const client = this.getHttpClient();
        const response = client.request('GET', 'http://localhost:8057', {
            http_version: '1.0',
        });

        __self.assertEquals(200, await response.getStatusCode());

        const body = await response.getDecodedContent();
        __self.assertEquals('HTTP/1.0', body.server.SERVER_PROTOCOL);
        __self.assertEquals('GET', body.server.REQUEST_METHOD);
    }

    async testChunkedEncoding() {
        const client = this.getHttpClient();
        let response = client.request('GET', 'http://localhost:8057/chunked');

        __self.assertEquals([ 'chunked' ], (await response.getHeaders())['transfer-encoding']);
        __self.assertEquals('Jymfony is awesome!', (await response.getContent()).toString());

        response = client.request('GET', 'http://localhost:8057/chunked-broken', {
            timeout: 1,
        });

        this.expectException(TransportException);
        await response.getContent();
    }

    async testClientError() {
        const client = this.getHttpClient();
        const response = client.request('GET', 'http://localhost:8057/404');

        __self.assertEquals(404, await response.getStatusCode());

        try {
            await response.getHeaders();
            this.fail(ReflectionClass.getClassName(ClientException) + ' expected');
        } catch (e) {
            if (! (e instanceof ClientException)) {
                throw e;
            }
        }

        try {
            await response.getContent();
            this.fail(ReflectionClass.getClassName(ClientException) + ' expected');
        } catch (e) {
            if (! (e instanceof ClientException)) {
                throw e;
            }
        }

        __self.assertEquals(404, await response.getStatusCode());
        __self.assertEquals([ 'application/json' ], (await response.getHeaders(false))['content-type']);
        __self.assertNotEmpty(await response.getContent(false));
    }

    async testIgnoreErrors() {
        const client = this.getHttpClient();
        const response = client.request('GET', 'http://localhost:8057/404');

        __self.assertSame(404, await response.getStatusCode());
        response.close();
    }

    async testDnsError() {
        const client = this.getHttpClient();
        const response = client.request('GET', 'http://localhost:8057/301/bad-tld');

        try {
            await response.getStatusCode();
            this.fail(ReflectionClass.getClassName(TransportException) + ' expected');
        } catch (e) {
            if (! (e instanceof TransportException)) {
                throw e;
            }

            __self.addToAssertionCount(1);
        }

        try {
            await response.getStatusCode();
            this.fail(ReflectionClass.getClassName(TransportException) + ' still expected');
        } catch (e) {
            if (! (e instanceof TransportException)) {
                throw e;
            }

            __self.addToAssertionCount(1);
        }
    }

    async testInlineAuth() {
        const client = this.getHttpClient();
        const response = client.request('GET', 'http://foo:bar%3Dbar@localhost:8057');

        const body = await response.getDecodedContent();

        __self.assertSame('foo', body.username);
        __self.assertSame('bar=bar', body.password);
    }

    async testBadRequestBody() {
        const client = this.getHttpClient();
        this.expectException(TransportException);

        const response = client.request('POST', 'http://localhost:8057/', {
            body: function * () {
                yield [];
            },
        });

        return response.getStatusCode();
    }

    async test304() {
        const client = this.getHttpClient();
        const response = client.request('GET', 'http://localhost:8057/304', {
            headers: {'If-Match': '"abc"'},
            buffer: true,
        });

        __self.assertSame(304, await response.getStatusCode());
        __self.assertSame(Buffer.from(''), (await response.getContent(false)));
    }

    async testRedirects() {
        const client = this.getHttpClient();
        const response = client.request('POST', 'http://localhost:8057/301', {
            auth_basic: 'foo:bar',
            body: 'foo=bar',
        });

        const body = await response.getDecodedContent();
        __self.assertSame('POST', body.method);
        __self.assertSame('Basic Zm9vOmJhcg==', body.headers.authorization[0]);
        __self.assertSame('http://localhost:8057/', await response.getInfo('url'));

        __self.assertSame(2, await response.getInfo('redirect_count'));
        __self.assertNull(await response.getInfo('redirect_url'));
    }

    async testShouldFailOnRedirectWithNonRepeatableBody() {
        const client = this.getHttpClient();
        const response = client.request('POST', 'http://localhost:8057/301', {
            auth_basic: 'foo:bar',
            body: function * () {
                yield 'foo=bar';
            },
        });

        this.expectException(TransportException);
        await response.getContent();
    }

    async testInvalidRedirect() {
        const client = this.getHttpClient();
        const response = client.request('GET', 'http://localhost:8057/301/invalid');

        __self.assertSame(301, await response.getStatusCode());
        __self.assertSame([ '//?foo=bar' ], (await response.getHeaders(false)).location);
        __self.assertSame(0, await response.getInfo('redirect_count'));
        __self.assertNull(await response.getInfo('redirect_url'));
        response.close();

        this.expectException(RedirectionException);
        await response.getHeaders();
    }

    async testRelativeRedirects() {
        const client = this.getHttpClient();
        let response = client.request('GET', 'http://localhost:8057/302/relative');

        const body = await response.getDecodedContent();

        __self.assertMatchesRegularExpression(/^http:\/\/(localhost|127\.0\.0\.1):8057\/$/, body.uri);
        __self.assertNull(await response.getInfo('redirect_url'));

        response = client.request('GET', 'http://localhost:8057/302/relative', {
            max_redirects: 0,
        });

        __self.assertSame(302, await response.getStatusCode());
        __self.assertMatchesRegularExpression(/^http:\/\/(localhost|127\.0\.0\.1):8057\/$/, await response.getInfo('redirect_url'));
        response.close();
    }

    async testRedirect307() {
        const client = this.getHttpClient();
        let response = client.request('POST', 'http://localhost:8057/307', {
            body: function * () {
                yield 'foo=bar';
            },
            max_redirects: 0,
        });

        __self.assertSame(307, await response.getStatusCode());
        response.close();

        response = client.request('POST', 'http://localhost:8057/307', {
            body: 'foo=bar',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
        });

        const body = await response.getDecodedContent();
        __self.assertSame({ foo: 'bar', REQUEST_METHOD: 'POST' }, body);
    }

    async testMaxRedirects() {
        const client = this.getHttpClient();
        const response = client.request('GET', 'http://localhost:8057/301', {
            max_redirects: 1,
            auth_basic: 'foo:bar',
        });

        try {
            await response.getHeaders();
            this.fail(ReflectionClass.getClassName(RedirectionException) + ' expected');
        } catch (e) {
            if (! (e instanceof RedirectionException)) {
                throw e;
            }
        }

        __self.assertSame(302, await response.getStatusCode());
        __self.assertSame(1, response.getInfo('redirect_count'));
        __self.assertSame('http://localhost:8057/', response.getInfo('redirect_url'));
        __self.assertEquals([ 'application/json' ], response.getInfo('response_headers')['content-type']);

        response.close();
    }

    async testOnProgress() {
        const steps = [];
        const client = this.getHttpClient();
        const response = client.request('POST', 'http://localhost:8057/post', {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: 'foo=0123456789',
            on_progress: function (...state) {
                steps.push(state);
            },
        });

        const body = await response.getDecodedContent();

        __self.assertSame({ foo: '0123456789', REQUEST_METHOD: 'POST' }, body);
        __self.assertSame([ undefined, undefined ], steps[0].slice(0, 2));

        const lastStep = steps[steps.length - 1];
        __self.assertSame([ 57, 57 ], lastStep.slice(0, 2));
        __self.assertSame('http://localhost:8057/post', steps[0][2].url);
    }

    async testPostJson() {
        const client = this.getHttpClient();
        const response = client.request('POST', 'http://localhost:8057/post', {
            json: {foo: 'bar'},
        });

        const body = await response.getDecodedContent();

        __self.assertStringContainsString('json', body['content-type']);
        delete body['content-type'];

        __self.assertSame({ foo: 'bar', REQUEST_METHOD: 'POST' }, body);
    }

    async testPostArray() {
        const client = this.getHttpClient();
        const response = client.request('POST', 'http://localhost:8057/post', {
            body: { foo: 'bar' },
        });

        __self.assertSame({ foo: 'bar', REQUEST_METHOD: 'POST' }, await response.getDecodedContent());
    }

    async testPostResource() {
        this.setTimeout(Infinity);
        const client = this.getHttpClient();

        const stream = new __jymfony.StreamBuffer();
        stream.write('foo=0123456789');

        const response = client.request('POST', 'http://localhost:8057/post', {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: stream,
        });

        __self.assertSame({ foo: '0123456789', REQUEST_METHOD: 'POST' }, await response.getDecodedContent(false));
    }

    async testPostCallback() {
        const client = this.getHttpClient();
        const response = client.request('POST', 'http://localhost:8057/post', {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: function * () {
                yield 'foo';
                yield '';
                yield '=';
                yield '0123456789';
            },
        });

        __self.assertSame({ foo: '0123456789', REQUEST_METHOD: 'POST' }, await response.getDecodedContent());
    }

    async testCancel() {
        const client = this.getHttpClient();
        const response = client.request('GET', 'http://localhost:8057/timeout-header');

        response.cancel();
        this.expectException(TransportException);
        await response.getHeaders();
    }

    async testInfoOnCanceledResponse() {
        const client = this.getHttpClient();

        const response = client.request('GET', 'http://localhost:8057/timeout-header');

        __self.assertFalse(response.getInfo('canceled'));
        response.cancel();
        __self.assertTrue(response.getInfo('canceled'));
    }

    async testOnProgressCancel() {
        const client = this.getHttpClient();
        const response = client.request('GET', 'http://localhost:8057/timeout-body', {
            on_progress: dlNow => {
                if (0 < dlNow) {
                    throw new Exception('Aborting the request.');
                }
            },
        });

        try {
            await response.getContent();
            this.fail(ReflectionClass.getClassName(ClientException) + ' expected');
        } catch (e) {
            if (! (e instanceof TransportException)) {
                throw e;
            }

            __self.assertSame('Aborting the request.', e.previous.message);
        }

        __self.assertNotNull(response.getInfo('error'));
        this.expectException(TransportException);
        await response.getContent();
    }

    async testOnProgressError() {
        const client = this.getHttpClient();
        const response = client.request('GET', 'http://localhost:8057/timeout-body', {
            on_progress: dlNow => {
                if (0 < dlNow) {
                    throw new Error('BUG.');
                }
            },
        });

        try {
            await response.getContent();
            this.fail('Error expected');
        } catch (e) {
            __self.assertSame('BUG.', e.message);
        }

        __self.assertNotNull(response.getInfo('error'));
        this.expectException(TransportException);
        await response.getContent();
    }

    async testResolve() {
        const client = this.getHttpClient();
        const response = client.request('GET', 'http://jymfony.net:8057/', {
            resolve: {'jymfony.net': '127.0.0.1'},
        });

        __self.assertSame(200, await response.getStatusCode());
        response.close();

        this.expectException(TransportException);
        client.request('GET', 'http://jymfony.net:8057/', { timeout: 1 });
    }

    async testIdnResolve() {
        const client = this.getHttpClient();

        let response = client.request('GET', 'http://0-------------------------------------------------------------0.com:8057/', {
            resolve: { '0-------------------------------------------------------------0.com': '127.0.0.1' },
        });
        __self.assertSame(200, await response.getStatusCode());
        response.close();

        response = client.request('GET', 'http://Bücher.example:8057/', {
            resolve: { 'xn--bcher-kva.example': '127.0.0.1' },
        });
        __self.assertSame(200, await response.getStatusCode());
        response.close();
    }

    async testProxy() {
        const client = this.getHttpClient();
        let response = client.request('GET', 'http://localhost:8057/', {
            proxy: 'http://localhost:8057',
        });

        let body = await response.getDecodedContent();
        __self.assertSame([ 'localhost:8057' ], body.headers.host);
        __self.assertMatchesRegularExpression(/^http:\/\/(localhost|127\.0\.0\.1):8057\/$/, body.uri);

        response = client.request('GET', 'http://localhost:8057/', {
            proxy: 'http://foo:b%3Dar@localhost:8057',
        });

        body = await response.getDecodedContent();
        __self.assertSame([ 'Basic Zm9vOmI9YXI=' ], body.headers['proxy-authorization']);
    }

    async testNoProxy() {
        process.env.no_proxy = 'example.com, localhost';

        try {
            const client = this.getHttpClient();
            const response = client.request('GET', 'http://localhost:8057/', {
                proxy: 'http://localhost:8057',
            });

            const body = await response.getDecodedContent();

            __self.assertSame('HTTP/1.1', body.server.SERVER_PROTOCOL);
            __self.assertSame('http://localhost:8057/', body.uri);
            __self.assertSame('GET', body.server.REQUEST_METHOD);
        } finally {
            delete process.env.no_proxy;
        }
    }

    async testAutoEncodingRequest() {
        const client = this.getHttpClient();
        const response = client.request('GET', 'http://localhost:8057');

        __self.assertSame(200, await response.getStatusCode());
        const headers = await response.getHeaders();
        __self.assertStringContainsString('gzip', headers['content-encoding'][0]);

        const body = await response.getDecodedContent();
        __self.assertStringContainsString('gzip', body.headers['accept-encoding'][0]);
    }

    async testBaseUri() {
        const client = this.getHttpClient();
        const response = client.request('GET', '../404', {
            base_uri: 'http://localhost:8057/abc/',
        });

        __self.assertSame(404, await response.getStatusCode());
        __self.assertSame([ 'application/json' ], (await response.getHeaders(false))['content-type']);

        response.close();
    }

    async testQuery() {
        const client = this.getHttpClient();
        const response = client.request('GET', 'http://localhost:8057/?a=a', {
            query: { b: 'b' },
        });

        const body = await response.getDecodedContent();
        __self.assertSame('GET', body.method);
        __self.assertSame('http://localhost:8057/?b=b&a=a', body.uri);
    }

    async testInformationalResponse() {
        const client = this.getHttpClient();
        const response = client.request('GET', 'http://localhost:8057/103');

        __self.assertSame('Here the body', (await response.getContent()).toString());
        __self.assertSame(200, await response.getStatusCode());
    }

    async testUserlandEncodingRequest() {
        const client = this.getHttpClient();
        const response = client.request('GET', 'http://localhost:8057', {
            headers: { 'Accept-Encoding': 'gzip' },
        });

        const headers = await response.getHeaders();

        __self.assertSame([ 'Accept-Encoding' ], headers.vary);
        __self.assertStringContainsString('gzip', headers['content-encoding'][0]);

        const body = await response.getDecodedContent();
        __self.assertSame([ 'gzip' ], body.headers['accept-encoding']);
    }

    async testGzipBroken() {
        const client = this.getHttpClient();
        const response = client.request('GET', 'http://localhost:8057/gzip-broken');

        this.expectException(TransportException);
        await response.getContent();
    }

    async testMaxDuration() {
        const client = this.getHttpClient();
        const response = client.request('GET', 'http://localhost:8057/max-duration', {
            max_duration: 0.1,
        });

        try {
            await response.getContent();
        } catch (e) {
            if (! (e instanceof TransportException)) {
                throw e;
            }

            __self.addToAssertionCount(1);
        }
    }

    async testLongFile() {
        const client = this.getHttpClient();
        const response = client.request('GET', 'http://localhost:8057/long-file');

        const content = await response.getContent();
        const decoded = Buffer.from(content.toString(), 'base64');
        __self.assertEquals(decoded.length, 80 * 1024);
    }

    async testLongFileCompressed() {
        const client = this.getHttpClient();
        const response = client.request('GET', 'http://localhost:8057/long-file-compressed');

        const content = await response.getContent();
        const decoded = Buffer.from(content.toString(), 'base64');
        __self.assertEquals(decoded.length, 80 * 1024);
    }
}
