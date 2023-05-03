declare namespace Jymfony.Component.HttpFoundation.Exception {
    /**
     * Represents an http exception, which generates a response
     * with the correct status code and headers.
     */
    export class HttpException extends mix(global.RuntimeException, HttpExceptionInterface) {
        private _headers: Record<string, string>;
        private _statusCode: number;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(statusCode: number, message: string, previous?: Error, headers?: Record<string, string>, code?: number): void;
        constructor(statusCode: number, message: string, previous?: Error, headers?: Record<string, string>, code?: number);

        /**
         * @inheritdoc
         */
        public readonly statusCode: number;

        /**
         * @inheritdoc
         */
        public headers: Record<string, string>;
    }
}
