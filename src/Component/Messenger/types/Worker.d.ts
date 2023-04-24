declare namespace Jymfony.Component.Messenger {
    import BatchHandlerInterface = Jymfony.Component.Messenger.Handler.BatchHandlerInterface;
    import EventDispatcherInterface = Jymfony.Contracts.EventDispatcher.EventDispatcherInterface;
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
    import ReceiverInterface = Jymfony.Component.Messenger.Transport.Receiver.ReceiverInterface

    interface WorkerOptions {
        sleep?: number;
        queues?: string[];
    }

    /**
     * @final
     */
    export class Worker {
        private _receivers: Record<string, ReceiverInterface>;
        private _bus: MessageBusInterface;
        private _logger: null | LoggerInterface;
        private _eventDispatcher: null | EventDispatcherInterface;
        private _metadata: WorkerMetadata;
        private _acks: [string, Envelope | null, Error | null][];
        private _unacks: Map<BatchHandlerInterface, [string, Envelope | null]>;
        private _shouldStop: boolean;

        __construct(receivers: Record<string, ReceiverInterface>, bus: MessageBusInterface, eventDispatcher?: EventDispatcherInterface, logger?: LoggerInterface): void;
        constructor(receivers: Record<string, ReceiverInterface>, bus: MessageBusInterface, eventDispatcher?: EventDispatcherInterface, logger?: LoggerInterface);

        /**
         * Receive the messages and dispatch them to the bus.
         *
         * Valid options are:
         *  * sleep (default: 1000000): Time in microseconds to sleep after no messages are found
         *  * queues: The queue names to consume from, instead of consuming from all queues. When this is used, all receivers must implement the QueueReceiverInterface
         */
        run(options?: WorkerOptions): Promise<void>;

        /**
         * Handle queue message.
         *
         * @param {Jymfony.Component.Messenger.Envelope} envelope
         * @param {string} transportName
         *
         * @returns {Promise<void>}
         */
        private _handleMessage(envelope: Envelope, transportName: string): Promise<void>;

        ack(): Promise<boolean>;

        private _flush(force: boolean): Promise<boolean>;

        stop(): void;

        public readonly metadata: WorkerMetadata;

        private _dispatchEvent(event: object): Promise<void>;
    }
}
