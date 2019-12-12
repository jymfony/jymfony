declare namespace Jymfony.Component.Filesystem.StreamWrapper.File {
    export class Resource {
        /**
         * File descriptor.
         */
        private _fd: number;

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
         *
         * @param {int} fd
         * @param {fs.Stats} stat
         */
        __construct(fd: number, stat: any): void;
        constructor(fd: number, stat: any);

        /**
         * Alters current resource position.
         */
        seek(position: number, whence?: 'set' | 'cur' | 'end'): void;

        /**
         * Gets the file descriptor number.
         */
        public readonly fd: number;

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
