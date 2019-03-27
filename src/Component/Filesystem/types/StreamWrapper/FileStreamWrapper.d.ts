declare namespace Jymfony.Component.Filesystem.StreamWrapper {
    /**
     * Implements a stream wrapper for the file:// protocol
     */
    export class FileStreamWrapper extends AbstractStreamWrapper {
        public static stat_cache_ttl: number;

        /**
         * @inheritdoc
         */
        public readonly protocol: string;

        /**
         * Normalizes path and urls to a simple path.
         */
        private static _getPath(path: string): string;

        /**
         * Cached and promisified readlink.
         */
        private static _readlink(path: string): Promise<string>;

        /**
         * Cached, promisified lstat.
         */
        private static _stat(path: string): Promise<any>;

        /**
         * Flushes the stat and readlink caches.
         */
        private static clearStatCache(): void;

        /**
         * @inheritdoc
         */
        readdir(path: string): Promise<string[]>;

        /**
         * @inheritdoc
         */
        mkdir(path: string, mode?: number, recursive?: boolean): Promise<void>;

        /**
         * @inheritdoc
         */
        rmdir(path: string, recursive?: boolean): Promise<void>;

        /**
         * @inheritdoc
         */
        rename(fromPath: string, toPath: string): Promise<string[]>;

        /**
         * @inheritdoc
         */
        streamOpen(path: string, mode: string): Promise<any>;

        /**
         * @inheritdoc
         */
        streamClose(resource: any): Promise<void>;

        /**
         * @inheritdoc
         */
        createReadableStream(resource: any): NodeJS.ReadableStream;

        /**
         * @inheritdoc
         */
        createWritableStream(resource: any): NodeJS.WritableStream;

        /**
         * @inheritdoc
         */
        streamRead(resource: any, count: number, position?: number, whence?: 'set' | 'cur' | 'end'): Promise<Buffer>;

        /**
         * @inheritdoc
         */
        streamWrite(resource: any, buffer: Buffer | any[] | Uint8Array | string, position?: number, whence?: 'set' | 'cur' | 'end'): Promise<number>;

        /**
         * @inheritdoc
         */
        streamTruncate(resource: any, length?: number): Promise<void>;

        /**
         * @inheritdoc
         */
        metadata(path: string, option: string, value: any): Promise<void>;

        /**
         * @inheritdoc
         */
        stat(path: string, options?: { stat_link: boolean }): Promise<any | boolean>;

        /**
         * @inheritdoc
         */
        unlink(path: string): Promise<void>;

        /**
         * @inheritdoc
         */
        symlink(origin: string, target: string): Promise<string>;

        /**
         * @inheritdoc
         */
        readlink(path: string): Promise<string>;

        /**
         * @inheritdoc
         */
        realpath(path: string): Promise<string>;
    }
}
