declare namespace Jymfony.Component.HttpFoundation.Exception {

    /**
     * Returns status code 405.
     */
    export class MethodNotAllowedHttpException extends HttpException {
        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(allow: string[], message: string, previous?: Error, headers?: Record<string, string>, code?: number): void;
        constructor(allow: string[], message: string, previous?: Error, headers?: Record<string, string>, code?: number);
    }
}
