declare namespace Jymfony.Component.HttpServer.RequestParser {
    /**
     * @internal
     *
     * @final
     */
    export class JsonEncodedParser extends implementationOf(ParserInterface) {
        private _request: NodeJS.ReadableStream;
        private _contentLength: number;
        private _charset: string;
        private _buffer: Buffer;

        /**
         * Constructor.
         */
        __construct(stream: NodeJS.ReadableStream, contentLength: number, charset: string): void;
        constructor(stream: NodeJS.ReadableStream, contentLength: number, charset: string);

        /**
         * @inheritdoc
         */
        public readonly buffer: Buffer;

        /**
         * @inheritdoc
         */
        parse(): Promise<Record<string, any>>;
    }
}
