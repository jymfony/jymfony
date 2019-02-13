declare namespace Jymfony.Component.Debug.Exception {
    /**
     * Debug exception thrown when an unhandled rejection event is fired.
     */
    export class UnhandledRejectionException extends RuntimeException {
        /**
         * Constructor.
         */
        constructor(promise: Promise<any>, previous?: Error);

        /**
         * Gets the rejected promise.
         */
        readonly promise: Promise<any>;
    }
}
