declare namespace Jymfony.Component.Messenger.EventListener {
    import ContainerInterface = Jymfony.Contracts.DependencyInjection.ContainerInterface;
    import Envelope = Jymfony.Component.Messenger.Envelope;
    import EventDispatcherInterface = Jymfony.Contracts.EventDispatcher.EventDispatcherInterface;
    import EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
    import EventSubscriptions = Jymfony.Contracts.EventDispatcher.EventSubscriptions;
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
    import RetryStrategyInterface = Jymfony.Component.Messenger.Retry.RetryStrategyInterface;
    import SenderInterface = Jymfony.Component.Messenger.Transport.Sender.SenderInterface;
    import StampInterface = Jymfony.Component.Messenger.Stamp.StampInterface;
    import WorkerMessageFailedEvent = Jymfony.Component.Messenger.Event.WorkerMessageFailedEvent;

    export class SendFailedMessageForRetryListener extends implementationOf(EventSubscriberInterface) {
        private _sendersLocator: ContainerInterface;
        private _retryStrategyLocator: ContainerInterface;
        private _logger: LoggerInterface | null;
        private _eventDispatcher: EventDispatcherInterface | null;
        private _historySize: number;

        /**
         * Constructor.
         *
         * @param sendersLocator
         * @param retryStrategyLocator
         * @param [logger = null]
         * @param [eventDispatcher = null]
         * @param [historySize = 10]
         */
        __construct(sendersLocator: ContainerInterface, retryStrategyLocator: ContainerInterface, logger?: LoggerInterface | null, eventDispatcher?: EventDispatcherInterface | null, historySize?: number): void;
        constructor(sendersLocator: ContainerInterface, retryStrategyLocator: ContainerInterface, logger?: LoggerInterface | null, eventDispatcher?: EventDispatcherInterface | null, historySize?: number);

        onMessageFailed(event: WorkerMessageFailedEvent): Promise<void>;

        static getSubscribedEvents(): EventSubscriptions;

        /**
         * Adds stamps to the envelope by keeping only the First + Last N stamps.
         */
        private _withLimitedHistory(envelope: Envelope, ...stamps: StampInterface[]): Envelope;

        private _shouldRetry(e: Error, envelope: Envelope, retryStrategy: RetryStrategyInterface): boolean;

        private _getRetryStrategyForTransport(alias: string): RetryStrategyInterface | null;

        private _getSenderForTransport(alias: string): SenderInterface;
    }
}
