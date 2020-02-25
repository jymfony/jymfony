declare namespace Jymfony.Component.Debug.Exception {
    export class ErrorException extends global.Exception {
        private _severity: string;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(message: string, code?: number, severity?: string): void;
        constructor(message: string, code?: number, severity?: string);

        /**
         * Gets the error severity.
         */
        public readonly severity: string;
    }
}
