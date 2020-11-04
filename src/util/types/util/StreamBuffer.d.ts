declare namespace __jymfony {
    /**
     * A writable stream that buffers all the content.
     */
    export class StreamBuffer implements NodeJS.WritableStream, NodeJS.ReadableStream {
        writable: boolean;
        readable: boolean;

        constructor(buffer?: Buffer);

        read(size?: number): string | Buffer;
        setEncoding(encoding: BufferEncoding): this;
        pause(): this;
        resume(): this;
        isPaused(): boolean;
        pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean; }): T;
        unpipe(destination?: NodeJS.WritableStream): this;
        unshift(chunk: string | Uint8Array, encoding?: BufferEncoding): void;
        wrap(oldStream: NodeJS.ReadableStream): this;
        [Symbol.asyncIterator](): AsyncIterableIterator<string | Buffer>;

        write(buffer: string | Buffer, cb?: Function): boolean;
        write(str: string, encoding?: string, cb?: Function): boolean;
        write(str: any, encoding?: any, cb?: any): boolean;

        end(cb?: Function): void;
        end(buffer: Buffer, cb?: Function): void;
        end(str: string, cb?: Function): void;
        end(str: string, encoding?: string, cb?: Function): void;
        end(str?: any, encoding?: any, cb?: any): void;

        addListener(event: string | symbol, listener: (...args: any[]) => void): this;
        on(event: string | symbol, listener: (...args: any[]) => void): this;
        once(event: string | symbol, listener: (...args: any[]) => void): this;
        removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
        off(event: string | symbol, listener: (...args: any[]) => void): this;
        removeAllListeners(event?: string | symbol): this;
        setMaxListeners(n: number): this;
        getMaxListeners(): number;
        listeners(event: string | symbol): Function[];
        rawListeners(event: string | symbol): Function[];
        emit(event: string | symbol, ...args: any[]): boolean;
        listenerCount(type: string | symbol): number;
        prependListener(event: string | symbol, listener: (...args: any[]) => void): this;
        prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;
        eventNames(): (string | symbol)[];

        /**
         * The buffer.
         */
        readonly buffer: Buffer;

        /**
         * The size of the data contained in the buffer.
         */
        readonly size: number;
    }
}
