/// <reference lib="esnext.asynciterable" />

declare namespace Jymfony.Component.Filesystem.Iterator {
    export class RecursiveDirectoryIterator implements AsyncIterable<string>, AsyncIterator<string> {
        public static readonly CHILD_FIRST = 1;
        public static readonly CHILD_LAST = 2;
        public static readonly FOLLOW_SYMLINKS = 4;

        private _path: string;
        private _flags: number;
        private _followSymlinks: boolean;
        private _dir: string[];
        private _after: string[];
        private current: string[];


        /**
         * Constructor.
         */
        __construct(filepath: string, flags?: string): void;
        constructor(filepath: string, flags?: string);

        /**
         * Make this object async-iterable.
         */
        [Symbol.asyncIterator](): RecursiveDirectoryIterator;

        /**
         * Iterates over values.
         */
        next(): Promise<IteratorResult<string>>;
    }
}
