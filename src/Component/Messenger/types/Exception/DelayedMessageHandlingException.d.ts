declare namespace Jymfony.Component.Messenger.Exception {
    /**
     * When handling queued messages from {@link DispatchAfterCurrentBusMiddleware},
     * some handlers caused an exception. This exception contains all those handler exceptions.
     */
    export class DelayedMessageHandlingException extends RuntimeException {
        private _exceptions: Error[];

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(exceptions: Error[]): void;
        constructor(exceptions: Error[]);

        public readonly exceptions: Error[];
    }
}
