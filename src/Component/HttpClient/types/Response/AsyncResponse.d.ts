declare namespace Jymfony.Component.HttpClient.Response {
    import CommonResponseTrait = Jymfony.Component.HttpClient.Response.CommonResponseTrait;
    import HttpClientInfo = Jymfony.Contracts.HttpClient.HttpClientInfo;
    import HttpClientInterface = Jymfony.Contracts.HttpClient.HttpClientInterface;
    import ResponseInterface = Jymfony.Contracts.HttpClient.ResponseInterface;

    type PassThruArg = {
        response: AsyncResponse;
        headers: () => Promise<Record<string, string[]>>;
        streamer: (Throw?: boolean) => Promise<Buffer | NodeJS.ReadableStream>;

        /** @internal */
        passthru: () => Promise<Buffer | NodeJS.ReadableStream>;
    }

    /**
     * Provides a single extension point to process a response's content stream.
     *
     * @final
     */
    export class AsyncResponse extends implementationOf(ResponseInterface, CommonResponseTrait) {
        private _client: HttpClientInterface;
        private _info: Record<string, any>;
        private _shouldBuffer: boolean | NodeJS.WritableStream | ((headers: Record<string, string[]>) => boolean | NodeJS.WritableStream);
        private _buffer: null | Buffer;
        private _response: ResponseInterface;
        private _passthru: (response, Throw) => Promise<void>;

        __construct(client: HttpClientInterface, method: string, url: string, options: Record<string, any>, passthru: (options: PassThruArg) => Promise<void>): void;
        constructor(client: HttpClientInterface, method: string, url: string, options: Record<string, any>, passthru: (options: PassThruArg) => Promise<void>);

        /**
         * @inheritdoc
         */
        getStatusCode(): Promise<number>;

        /**
         * @inheritdoc
         */
        getHeaders(Throw?: string): Promise<Record<string, string[]>>;


        /**
         * @inheritdoc
         */
        getInfo(): HttpClientInfo;
        getInfo(type: null): HttpClientInfo;
        getInfo<T extends keyof HttpClientInfo>(type: T): HttpClientInfo[T];
        getInfo(type: any): any;

        /**
         * Sets an info into this response object.
         */
        setInfo(type: string, value: any): void;

        /**
         * @inheritdoc
         */
        close(): void;

        /**
         * @inheritdoc
         */
        private _perform(): Promise<void>;

        /**
         * Replaces the currently processed response by doing a new request.
         */
        replaceRequest(method: string, url: string, options?: Record<string, any>): void;

        /**
         * @inheritdoc
         */
        cancel(): void;

        /**
         * @inheritdoc
         */
        getContent(Throw?: boolean): Promise<Buffer | NodeJS.ReadableStream>;

        /**
         * Create a readable stream to pass data through.
         * Could be intercepted by passthru closure passed as last argument in constructor.
         *
         * @private
         */
        static _passthru(response: AsyncResponse, Throw: boolean): Promise<NodeJS.ReadableStream | Buffer>;
    }
}
