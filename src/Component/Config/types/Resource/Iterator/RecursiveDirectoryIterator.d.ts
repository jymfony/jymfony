declare namespace Jymfony.Component.Config.Resource.Iterator {
    export class RecursiveDirectoryIterator implements Iterator<string>, Iterable<string> {
        private _path: string;
        private _dir: undefined|string[];
        private _current: undefined|string;

        /**
         * Constructor.
         */
        __construct(filepath: string): void;
        constructor(filepath: string);

        /**
         * Make this object iterable.
         */
        [Symbol.iterator](): RecursiveDirectoryIterator;

        /**
         * Iterates over values.
         */
        next(): IteratorResult<string>;
    }
}
