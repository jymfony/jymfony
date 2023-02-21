declare namespace Jymfony.Component.Messenger.EventListener {
    import EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
    import EventSubscriptions = Jymfony.Contracts.EventDispatcher.EventSubscriptions;
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
    import WorkerStartedEvent = Jymfony.Component.Messenger.Event.WorkerStartedEvent;

    export class StopWorkerOnSigtermSignalListener extends implementationOf(EventSubscriberInterface) {
        private _logger: LoggerInterface;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(logger?: LoggerInterface): void;
        constructor(logger?: LoggerInterface);

        onWorkerStarted(event: WorkerStartedEvent): void;

        static getSubscribedEvents(): EventSubscriptions;
    }
}
