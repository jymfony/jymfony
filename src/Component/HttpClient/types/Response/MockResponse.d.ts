declare namespace Jymfony.Component.HttpClient.Response {
    import CommonResponseTrait = Jymfony.Component.HttpClient.Response.CommonResponseTrait;
    import HttpClientInfo = Jymfony.Contracts.HttpClient.HttpClientInfo;
    import ResponseInterface = Jymfony.Contracts.HttpClient.ResponseInterface;

    /**
     * A test-friendly response.
     */
    export class MockResponse extends implementationOf(ResponseInterface, CommonResponseTrait) {
        private _id: number;
        private _body: string | string[] | IterableIterator<string>;
        private _info: HttpClientInfo;
        private _requestOptions: Record<string, any>;
        private _requestUrl: string;
        private _requestMethod: string;
        private _buffer: Buffer;
        private _initializer: () => boolean;
        private _headers: Record<string, string[]>;

        /**
         * @param body The response body as a string or an iterable of strings,
         *      yielding an empty string simulates an idle timeout, exceptions are turned to TransportException
         * @param info
         *
         * @see ResponseInterface.getInfo() for possible info, e.g. "response_headers"
         */
        __construct(body?: string | string[] | IterableIterator<string>, info?: HttpClientInfo): void;

        constructor(body?: string | string[] | IterableIterator<string>, info?: HttpClientInfo);

        /**
         * @inheritdoc
         */
        getHeaders(Throw?: boolean): Promise<Record<string, string[]>>;

        /**
         * Returns the options used when doing the request.
         */
        get requestOptions(): Record<string, any>;

        /**
         * Returns the URL used when doing the request.
         */
        get requestUrl(): string;

        /**
         * Returns the method used when doing the request.
         */
        get requestMethod(): string;

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
        cancel(): void;

        /**
         * @inheritdoc
         */
        close(): void;

        /**
         * @private
         */
        private _initialize(): Promise<void>;

        /**
         * @internal
         */
        static fromRequest(method: string, url: string, options: Record<string, any>, mock: MockResponse | any): MockResponse;

        /**
         * @inheritdoc
         */
        getContent(Throw?: boolean): Promise<Buffer | NodeJS.ReadableStream>;

        /**
         * @inheritdoc
         */
        _perform(response: ResponseInterface, options: Record<string, any>): Promise<void>;

        /**
         * Simulates sending the request.
         *
         * @private
         */
        static _writeRequest(response: MockResponse, options: Record<string, any>, mock: MockResponse): Promise<void>;
    }
}
