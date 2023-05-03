declare namespace Jymfony.Component.Filesystem.Exception {
    export class IOException extends mix(global.RuntimeException, ExceptionInterface) {
        public readonly path: string|undefined;
        private _path?: string;

        /**
         * Constructor.
         */
        __construct(message: string, code?: number, previous?: Error, path?: string): void;
        constructor(message: string, code?: number, previous?: Error, path?: string);
    }
}
