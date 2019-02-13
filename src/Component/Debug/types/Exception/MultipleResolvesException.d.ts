declare namespace Jymfony.Component.Debug.Exception {
    /**
     * Debug exception thrown when promise has been resolved or rejected multiple times.
     */
    export class MultipleResolvesException extends RuntimeException {
        /**
         * Constructor.
         */
        constructor(type: string, promise: Promise<any>, value: any);

        /**
         * Gets the resolved promise.
         */
        readonly promise: Promise<any>;

        /**
         * The value with which the promise was either resolved or rejected after the original resolve.
         */
        readonly value: any;
    }
}
