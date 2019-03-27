declare namespace Jymfony.Component.Filesystem.StreamWrapper {
    /**
     * Implements a stream wrapper for the http:// protocol
     */
    export class HttpStreamWrapper extends AbstractStreamWrapper {
        public static stat_cache_ttl: number;

        /**
         * @inheritdoc
         */
        public readonly protocol: string;

        private static head(path: string): any;

        private static lstat(path: string): any;

        /**
         * Cached, promisified lstat.
         */
        private static stat(path: string): any;

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
        streamRead(resource: any, count: number, position?: number, whence?: 'set' | 'cur' | 'end'): Promise<Buffer>;

        /**
         * @inheritdoc
         */
        stat(path: string, options?: { stat_link: boolean }): Promise<any | boolean>;

        /**
         * @inheritdoc
         */
        readlink(path: string): Promise<string>;
    }
}
