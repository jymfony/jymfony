declare namespace Jymfony.Component.Filesystem.StreamWrapper {
    /**
     * Abstract stream wrapper implementation.
     * All the methods will throw an UnsupportedOperationException.
     *
     * @abstract
     */
    export abstract class AbstractStreamWrapper extends implementationOf(StreamWrapperInterface) {
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
