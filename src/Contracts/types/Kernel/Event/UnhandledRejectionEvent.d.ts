declare namespace Jymfony.Contracts.Kernel.Event {
    import Event = Jymfony.Contracts.EventDispatcher.Event;

    /**
     * Event triggered on unhandled promise rejection.
     */
    export class UnhandledRejectionEvent extends Event {
        private _reason: Error;
        private _promise: Promise<any>;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(reason: Error, promise: Promise<any>): void;
        constructor(reason: Error, promise: Promise<any>);

        /**
         * Gets the unhandled error.
         */
        public readonly reason: Error;

        /**
         * Gets the rejected promise.
         */
        public readonly promise: Promise<any>;
    }
}
