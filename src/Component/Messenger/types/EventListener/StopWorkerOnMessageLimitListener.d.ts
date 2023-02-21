declare namespace Jymfony.Component.Messenger.EventListener {
    import EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
    import EventSubscriptions = Jymfony.Contracts.EventDispatcher.EventSubscriptions;
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
    import WorkerRunningEvent = Jymfony.Component.Messenger.Event.WorkerRunningEvent;

    export class StopWorkerOnMessageLimitListener extends implementationOf(EventSubscriberInterface) {
        private _maximumNumberOfMessages: number;
        private _logger: LoggerInterface | null;
        private _receivedMessages: number;

        /**
         * Constructor.
         */
        __construct(maximumNumberOfMessages: number, logger?: LoggerInterface): void;
        constructor(maximumNumberOfMessages: number, logger?: LoggerInterface);

        onWorkerRunning(event: WorkerRunningEvent): void;

        static getSubscribedEvents(): EventSubscriptions;
    }
}
