declare namespace Jymfony.Component.HttpServer.Exception {
    export class InvalidJsonBodyException extends BadRequestException {
        private _invalidBody: string;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(invalidBody: string, message?: string, code?: number | null, previous?: Error): void;
        constructor(invalidBody: string, message?: string, code?: number | null, previous?: Error);

        public readonly invalidBody: string;
    }
}
