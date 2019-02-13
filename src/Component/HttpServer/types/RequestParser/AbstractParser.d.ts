declare namespace Jymfony.Component.HttpServer.RequestParser {
    import UploadedFile = Jymfony.Component.HttpFoundation.File.UploadedFile;

    /**
     * @internal
     */
    export abstract class AbstractParser extends implementationOf(ParserInterface) {
        private _request: NodeJS.ReadableStream;
        private _contentLength: number;
        private _buffer: Buffer;

        /**
         * Constructor.
         */
        __construct(stream: NodeJS.ReadableStream, contentLength: number): void;
        constructor(stream: NodeJS.ReadableStream, contentLength: number);

        /**
         * @inheritdoc
         */
        public readonly buffer: Buffer;

        /**
         * Decodes a string buffer into a request param object.
         */
        abstract decode(buffer: string): Record<string, any | UploadedFile>[];

        /**
         * @inheritdoc
         */
        parse(): Promise<Record<string, any>>;
    }
}
