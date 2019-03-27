declare namespace Jymfony.Component.HttpFoundation.Exception {

    /**
     * Represents a not found exception.
     * Returns status code 404.
     */
    export class NotFoundHttpException extends HttpException {
        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(message: string, previous?: Error, headers?: Record<string, string>, code?: number): void;
        constructor(message: string, previous?: Error, headers?: Record<string, string>, code?: number);
    }
}
