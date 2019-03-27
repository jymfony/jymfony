declare namespace Jymfony.Component.Filesystem.StreamWrapper {
    export class StreamWrapperInterface {
        /**
         * Retrieve informations about a link. Do not follow the link itself.
         */
        public static readonly STREAM_URL_STAT_LINK = 0x1;

        public static readonly META_TOUCH = 'touch';
        public static readonly META_OWNER_NAME = 'chown_name';
        public static readonly META_OWNER = 'chown';
        public static readonly META_GROUP_NAME = 'chgrp_name';
        public static readonly META_GROUP = 'chgrp';
        public static readonly META_ACCESS = 'chmod';

        /**
         * Gets the protocol for the current stream wrapper.
         */
        public protocol: string;

        /**
         * Performs readdir operation into the directory specified
         * and returns an array of strings representing the names
         * of the files contained in the directory.
         *
         * @throws {Jymfony.Component.Filesystem.Exception.UnsupportedOperationException}
         */
        readdir(path: string): Promise<string[]>;

        /**
         * Creates a directory, if supported.
         * If the stream does not support directories, this
         * call should be ignored.
         */
        mkdir(path: string, mode?: number, recursive?: boolean): Promise<void>;

        /**
         * Removes (optionally recursively) a directory.
         * If recursive is set to true, all the files and the subdirectories
         * should be deleted before the specified path.
         */
        rmdir(path: string, recursive?: boolean): Promise<void>;

        /**
         * Renames a file/directory.
         *
         * @throws {Jymfony.Component.Filesystem.Exception.UnsupportedOperationException}
         */
        rename(fromPath: string, toPath: string): Promise<string[]>;

        /**
         * Opens a stream and returns the opened resource.
         */
        streamOpen(path: string, mode: string): Promise<any>;

        /**
         * Closes a resource. All the resource locked or allocated
         * by the resource should be released.
         */
        streamClose(resource: any): Promise<void>;

        /**
         * Creates a readable stream from an opened file.
         */
        createReadableStream(resource: any): NodeJS.ReadableStream;

        /**
         * Creates a writable stream from an opened file.
         */
        createWritableStream(resource: any): NodeJS.WritableStream;

        /**
         * Reads some bytes from the given resource.
         */
        streamRead(resource: any, count: number, position?: number, whence?: 'set'|'cur'|'end'): Promise<Buffer>;

        /**
         * Writes some bytes to the given resource and
         * returns the bytes written count.
         */
        streamWrite(resource: any, buffer: Buffer|any[]|Uint8Array|string, position?: number, whence?: 'set'|'cur'|'end'): Promise<number>;

        /**
         * Truncates a stream to a given length.
         */
        streamTruncate(resource: any, length?: number): Promise<void>;

        /**
         * Change file metadata.
         */
        metadata(path: string, option: string, value: any): Promise<void>;

        /**
         * Returns stats informations about the given path.
         */
        stat(path: string, options?: { stat_link: boolean }): Promise<any|boolean>;

        /**
         * Removes a file.
         */
        unlink(path: string): Promise<void>;

        /**
         * Creates a symbolic link.
         */
        symlink(origin: string, target: string): Promise<string>;

        /**
         * Resolves a symbolic link.
         */
        readlink(path: string): Promise<string>;

        /**
         * Resolves and canonicalize a path.
         */
        realpath(path: string): Promise<string>;
    }
}
