declare namespace Jymfony.Component.Filesystem.StreamWrapper.Http {
    export class Resource {
        public date: Date | undefined;
        public isLink: boolean;
        public location: string;
        public exists: boolean;

        private _path: string;
        private _size: number | undefined;
        private _internalBuffer: Buffer;
        private _position: number;

        /**
         * Constructor.
         */
        __construct(path: string, headers: Record<string, string>): void;
        constructor(path: string, headers: Record<string, string>);

        /**
         * Gets the size of the resource in bytes, if returned by the server.
         */
        public readonly size: number;

        /**
         * Creates a readable stream for this HTTP resource.
         *
         * @returns {Promise<Stream.Readable>}
         */
        readableStream(): Promise<NodeJS.ReadableStream>;

        /**
         * Reads "count" bytes from the stream.
         */
        fread(count: number): Promise<Buffer | null>;

        /**
         * Alters current resource position.
         */
        seek(position: number, whence?: 'set' | 'cur' | 'end'): void;

        /**
         * Performs a HEAD request and returns the headers.
         */
        static head(path: string): Promise<Record<string, string>>;

        /**
         * Parses header and status line.
         */
        private static _parseHeaders(headers: string[]): Record<string, string>;

        /**
         * Creates a socket.
         */
        private static _socket(url: any): Promise<NodeJS.Socket>;
    }
}
