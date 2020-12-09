declare namespace Jymfony.Contracts.HttpClient.Test {
    import TestCase = Jymfony.Component.Testing.Framework.TestCase;
    import HttpClientInterface = Jymfony.Contracts.HttpClient.HttpClientInterface;

    /**
     * A reference test suite for HttpClientInterface implementations.
     *
     * @abstract
     */
    export abstract class HttpClientTestCase extends TestCase {
        before(): Promise<void>;
        after(): Promise<void>;

        public readonly defaultTimeout: number;

        abstract getHttpClient(): HttpClientInterface;

        testGetRequest(): Promise<void>;
        testHeadRequest(): Promise<void>;
        testNonBufferedGetRequest(): Promise<void>;
        testBufferSink(): Promise<void>;
        testConditionalBuffering(): Promise<void>;
        testReentrantBufferCallback(): Promise<void>;
        testThrowingBufferCallback(): Promise<void>;
        testUnsupportedOption(): Promise<void>;
        testHttpVersion(): Promise<void>;
        testChunkedEncoding(): Promise<void>;
        testClientError(): Promise<void>;
        testIgnoreErrors(): Promise<void>;
        testDnsError(): Promise<void>;
        testInlineAuth(): Promise<void>;
        testBadRequestBody(): Promise<void>;
        test304(): Promise<void>;
        testRedirects(): Promise<void>;
        testShouldFailOnRedirectWithNonRepeatableBody(): Promise<void>;
        testInvalidRedirect(): Promise<void>;
        testRelativeRedirects(): Promise<void>;
        testRedirect307(): Promise<void>;
        testMaxRedirects(): Promise<void>;
        testOnProgress(): Promise<void>;
        testPostJson(): Promise<void>;
        testPostArray(): Promise<void>;
        testPostResource(): Promise<void>;
        testPostCallback(): Promise<void>;
        testCancel(): Promise<void>;
        testInfoOnCanceledResponse(): Promise<void>;
        testOnProgressCancel(): Promise<void>;
        testOnProgressError(): Promise<void>;
        testResolve(): Promise<void>;
        testIdnResolve(): Promise<void>;
        testProxy(): Promise<void>;
        testNoProxy(): Promise<void>;
        testAutoEncodingRequest(): Promise<void>;
        testBaseUri(): Promise<void>;
        testQuery(): Promise<void>;
        testInformationalResponse(): Promise<void>;
        testUserlandEncodingRequest(): Promise<void>;
        testGzipBroken(): Promise<void>;
        testMaxDuration(): Promise<void>;
    }
}
