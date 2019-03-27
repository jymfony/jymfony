declare namespace Jymfony.Component.HttpServer.RequestParser {
    import UploadedFile = Jymfony.Component.HttpFoundation.File.UploadedFile;

    /**
     * @internal
     *
     * @final
     */
    export class MultipartParser extends AbstractParser {
        private _boundary: string;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(stream: NodeJS.ReadableStream, contentType: number, contentLength: number | undefined): void;

        constructor(stream: NodeJS.ReadableStream, contentType: number, contentLength: number | undefined);

        /**
         * @inheritdoc
         */
        decode(buffer: string): Record<string, any | UploadedFile>[];

        /**
         * Parse header line.
         */
        private _parseHeader(headerLine: string): [string, any];
    }
}
