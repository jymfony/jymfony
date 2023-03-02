declare namespace Jymfony.Component.Messenger.EventListener {
    import EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
    import EventSubscriptions = Jymfony.Contracts.EventDispatcher.EventSubscriptions;
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
    import WorkerRunningEvent = Jymfony.Component.Messenger.Event.WorkerRunningEvent;

    export class StopWorkerOnFailureLimitListener extends implementationOf(EventSubscriberInterface) {
        private _maximumNumberOfFailures: number;
        private _logger: LoggerInterface;
        private _failedMessages: number;

        /**
         * Constructor.
         *
         * @param {int} maximumNumberOfFailures
         * @param {Jymfony.Contracts.Logger.LoggerInterface} [logger = null]
         */
        __construct(maximumNumberOfFailures: number, logger?: LoggerInterface): void;

        onMessageFailed(): void;

        /**
         * @param {Jymfony.Component.Messenger.Event.WorkerRunningEvent} event
         */
        onWorkerRunning(event: WorkerRunningEvent);

        static getSubscribedEvents(): EventSubscriptions;
    }
}
