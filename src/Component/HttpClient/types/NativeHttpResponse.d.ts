declare namespace Jymfony.Component.HttpClient {
    import CommonResponseTrait = Jymfony.Component.HttpClient.CommonResponseTrait;
    import HttpClientRequestOptions = Jymfony.Contracts.HttpClient.HttpClientRequestOptions;
    import HttpClientInfo = Jymfony.Contracts.HttpClient.HttpClientInfo;
    import ResponseInterface = Jymfony.Contracts.HttpClient.ResponseInterface;

    export class NativeHttpResponse extends implementationOf(ResponseInterface, CommonResponseTrait) {
        private _url: URL;
        private _options: HttpClientRequestOptions;
        private _context: Record<string, any>;
        private _info: HttpClientInfo;
        private _resolver: () => Promise<[(() => Promise<string>), URL]>;
        private _onProgress: (dlNow: number, dlSize: number, info: HttpClientInfo) => void;
        private _finalInfo: HttpClientInfo;
        private _headers: Record<string, string[]>;
        private _message: NodeJS.ReadableStream;
        private _readable: NodeJS.ReadableStream;
        private _buffer: null | Buffer;
        private _remaining: null | number;
        private _abortController: undefined | AbortController;
        private _initializer: () => boolean;
        private _timeout: number | null;

        /**
         * Constructor.
         */
        __construct(url: URL, options: HttpClientRequestOptions, info: HttpClientInfo, context: Record<string, any>, resolver: () => Promise<[() => Promise<string>, URL]>, onProgress: (dlNow: number, dlSize: number, info: HttpClientInfo) => void): void;
        constructor(url: URL, options: HttpClientRequestOptions, info: HttpClientInfo, context: Record<string, any>, resolver: () => Promise<[() => Promise<string>, URL]>, onProgress: (dlNow: number, dlSize: number, info: HttpClientInfo) => void);

        /**
         * @inheritdoc
         */
        getHeaders(Throw?: boolean): Promise<Record<string, string[]>>;

        /**
         * @inheritdoc
         */
        cancel(): void;

        /**
         * @inheritdoc
         */
        getInfo(): HttpClientInfo;
        getInfo(type: null): HttpClientInfo;
        getInfo<T extends keyof HttpClientInfo>(type: T): HttpClientInfo[T];
        getInfo(type: any): any;

        /**
         * @inheritdoc
         */
        getContent(Throw?: boolean): Promise<Buffer>;

        /**
         * @inheritdoc
         */
        close(): void;

        private _pipeline(input: NodeJS.ReadableStream, output: NodeJS.WritableStream): Promise<void>;
        private _perform(): Promise<void>;
        private _open(): Promise<void>;

        /**
         * Adds status code and headers to this response from http1 incoming message.
         */
        private _addHttp1ResponseHeaders(): void;

        /**
         * Adds status code and headers to this response from http2 headers.
         */
        private _addHttp2ResponseHeaders(headers: Record<string, any>): void;
    }
}
