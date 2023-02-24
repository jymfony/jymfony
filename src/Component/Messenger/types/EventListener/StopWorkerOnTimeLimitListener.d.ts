declare namespace Jymfony.Component.Messenger.EventListener {
    import EventSubscriptions = Jymfony.Contracts.EventDispatcher.EventSubscriptions;
    import EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
    import WorkerRunningEvent = Jymfony.Component.Messenger.Event.WorkerRunningEvent;

    export class StopWorkerOnTimeLimitListener extends implementationOf(EventSubscriberInterface) {
        private _timeLimitInSeconds: number;
        private _logger: LoggerInterface;
        private _endTime: number;

        /**
         * Constructor.
         */
        __construct(timeLimitInSeconds: number, logger?: LoggerInterface): void;
        constructor(timeLimitInSeconds: number, logger?: LoggerInterface);

        onWorkerStarted(): void;

        onWorkerRunning(event: WorkerRunningEvent): void;

        static getSubscribedEvents(): EventSubscriptions;
    }
}
