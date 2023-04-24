declare namespace Jymfony.Component.Messenger.EventListener {
    import EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
    import EventSubscriptions = Jymfony.Contracts.EventDispatcher.EventSubscriptions;
    import WorkerMessageFailedEvent = Jymfony.Component.Messenger.Event.WorkerMessageFailedEvent;
    import WorkerRunningEvent = Jymfony.Component.Messenger.Event.WorkerRunningEvent;

    export class StopWorkerOnCustomStopExceptionListener extends implementationOf(EventSubscriberInterface) {
        private _stop: boolean;

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        onMessageFailed(event: WorkerMessageFailedEvent): void;

        onWorkerRunning(event: WorkerRunningEvent): void;

        static getSubscribedEvents(): EventSubscriptions;
    }
}
