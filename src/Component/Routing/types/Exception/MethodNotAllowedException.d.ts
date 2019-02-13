declare namespace Jymfony.Component.Routing.Exception {
    /**
     * The resource was found but the request method is not allowed.
     * This exception should trigger an HTTP 405 response in your application code.
     */
    export class MethodNotAllowedException extends mix(RuntimeException, ExceptionInterface) {
        private _allowedMethods: string[];

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(allowedMethods: string[], message?: string, code?: number | null, previous?: Error): void;
        constructor(allowedMethods: string[], message?: string, code?: number | null, previous?: Error);

        /**
         * Gets the allowed HTTP methods.
         */
        public readonly allowedMethods: string[];
    }
}
