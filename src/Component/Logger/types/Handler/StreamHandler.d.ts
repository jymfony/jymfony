declare namespace Jymfony.Component.Logger.Handler {
    export class StreamHandler extends AbstractProcessingHandler {
        private _file: string;
        private _filePermission: string;
        private _stream: NodeJS.WritableStream;
        private _dirCreated: boolean;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(stream: NodeJS.WritableStream | string, level?: number, bubble?: boolean, filePermission?: string): void;
        constructor(stream: NodeJS.WritableStream | string, level?: number, bubble?: boolean, filePermission?: string);

        /**
         * Opens the stream if needed.
         */
        open(): void;

        /**
         * Flushes the stream and closes it.
         */
        close(): void;

        /**
         * @inheritdoc
         */
        protected _write(record: LogRecord): void;

        /**
         * Writes a record to the stream.
         */
        private _streamWrite(record: LogRecord): void;

        /**
         * Creates a dir where to put the log file to be created.
         */
        private _createDir(): void;
    }
}
