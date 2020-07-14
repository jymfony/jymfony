declare namespace Jymfony.Component.Dotenv.Exception {
    export class FormatExceptionContext {
        private _data: string;
        private _path: string;
        private _lineno: number;
        private _cursor: number;

        /**
         * Constructor.
         */
        __construct(data: string, path: string, lineno: number, cursor: number): void;
        constructor(data: string, path: string, lineno: number, cursor: number);

        public readonly path: string;
        public readonly lineNo: number;
        public readonly details: string;
    }
}
