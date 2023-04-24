declare namespace Jymfony.Component.Messenger.EventListener {
    import ContainerInterface = Jymfony.Contracts.DependencyInjection.ContainerInterface;
    import EventSubscriptions = Jymfony.Contracts.EventDispatcher.EventSubscriptions;
    import EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
    import WorkerMessageFailedEvent = Jymfony.Component.Messenger.Event.WorkerMessageFailedEvent;

    /**
     * Sends a rejected message to a "failure transport".
     */
    export class SendFailedMessageToFailureTransportListener extends implementationOf(EventSubscriberInterface) {
        private _failureSenders: ContainerInterface;
        private _logger: LoggerInterface;

        /**
         * Constructor.
         */
        __construct(failureSenders: ContainerInterface, logger?: LoggerInterface): void;
        constructor(failureSenders: ContainerInterface, logger?: LoggerInterface);

        onMessageFailed(event: WorkerMessageFailedEvent): Promise<void>;

        static getSubscribedEvents(): EventSubscriptions;
    }
}
