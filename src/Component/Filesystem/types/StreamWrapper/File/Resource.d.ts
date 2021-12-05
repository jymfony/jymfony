declare namespace Jymfony.Component.Filesystem.StreamWrapper.File {
    export class Resource {
        /**
         * File descriptor.
         */
        private _handle: any;

        /**
         * Current position.
         */
        private _position: number;

        /**
         * File stats at opening.
         */
        private _stats: any;

        /**
         * Constructor.
         */
        __construct(handle: any, stat: any): void;
        constructor(handle: any, stat: any);

        /**
         * Alters current resource position.
         */
        seek(position: number, whence?: 'set' | 'cur' | 'end'): void;

        /**
         * Gets the file handle.
         */
        public readonly handle: any;

        /**
         * Gets the current position.
         */
        public readonly position: number;

        /**
         * Advances position of the stream of count bytes.
         */
        advance(count: number): void;
    }
}
