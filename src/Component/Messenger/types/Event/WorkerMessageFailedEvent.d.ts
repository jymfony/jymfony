declare namespace Jymfony.Component.Messenger.Event {
    /**
     * Dispatched when a message was received from a transport and handling failed.
     *
     * The event name is the class name.
     */
    export class WorkerMessageFailedEvent extends AbstractWorkerMessageEvent {
        private _throwable: Error;
        private _willRetry: boolean;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(envelope: Envelope, receiverName: string, error: Error): void;
        constructor(envelope: Envelope, receiverName: string, error: Error);

        public readonly throwable: Error;

        public readonly willRetry: boolean;

        setForRetry(): void;
    }
}
