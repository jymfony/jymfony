declare namespace Jymfony.Component.HttpServer.Exception {
    export class BadContentLengthRequestException extends BadRequestException {
        /**
         * Constructor.
         */
        __construct(message?: string, code?: number | null, previous?: Error): void;
        constructor(message?: string, code?: number | null, previous?: Error);
    }
}
