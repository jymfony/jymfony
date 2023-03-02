declare namespace Jymfony.Component.Messenger.EventListener {
    import EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
    import EventSubscriptions = Jymfony.Contracts.EventDispatcher.EventSubscriptions;
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
    import WorkerRunningEvent = Jymfony.Component.Messenger.Event.WorkerRunningEvent;

    export class StopWorkerOnMemoryLimitListener extends implementationOf(EventSubscriberInterface) {
        private _memoryLimit: number;
        private _logger: LoggerInterface;
        private _memoryResolver: () => number;

        /**
         * Constructor.
         */
        __construct(memoryLimit: number, logger?: LoggerInterface, memoryResolver?: () => number): void;
        constructor(memoryLimit: number, logger?: LoggerInterface, memoryResolver?: () => number);

        /**
         * @param {Jymfony.Component.Messenger.Event.WorkerRunningEvent} event
         */
        onWorkerRunning(event: WorkerRunningEvent): void;

        static getSubscribedEvents(): EventSubscriptions;
    }
}
