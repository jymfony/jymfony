declare namespace Jymfony.Component.Filesystem {
    export class OpenFile extends File {
        /**
         * Open file's resource.
         */
        private _internalResource?: Promise<any>;
        private readonly _resource?: Promise<any>;

        /**
         * Whether the file is closed or not.
         */
        private _closed: boolean;

        __construct(fileName: string, mode?: string): void;
        constructor(fileName: string, mode?: string);

        /**
         * Closes the file.
         */
        close(): Promise<void>;

        /**
         * Reads a single byte from the file.
         */
        fgetc(): Promise<number>;

        /**
         * Reads a line from the file.
         *
         * @returns {Promise<string>}
         */
        fgets(): Promise<string>;

        /**
         * Reads "count" bytes from the stream.
         */
        fread(count: number): Promise<Buffer>;

        /**
         * Writes a buffer to the stream.
         */
        fwrite(buffer: Buffer): Promise<number>;

        /**
         * Writes a buffer to the stream.
         */
        ftruncate(length: number): Promise<void>;

        /**
         * Creates a readable stream object.
         */
        createReadableStream(): Promise<NodeJS.ReadableStream>;

        /**
         * Creates a writable stream object.
         */
        createWritableStream(): Promise<NodeJS.WritableStream>;

        /**
         * Asserts that the file is still open.
         */
        private _assertOpen(): void;
    }
}
