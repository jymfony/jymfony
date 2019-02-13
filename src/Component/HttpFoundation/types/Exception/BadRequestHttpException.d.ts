declare namespace Jymfony.Component.HttpFoundation.Exception {
    export class BadRequestHttpException extends HttpException {
        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(message: string, previous?: Error, headers?: Record<string, string>, code?: number): void;
        constructor(message: string, previous?: Error, headers?: Record<string, string>, code?: number);
    }
}
