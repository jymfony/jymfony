declare namespace Jymfony.Component.Messenger.EventListener {
    import EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
    import EventSubscriptions = Jymfony.Contracts.EventDispatcher.EventSubscriptions;
    import WorkerMessageFailedEvent = Jymfony.Component.Messenger.Event.WorkerMessageFailedEvent;

    export class AddErrorDetailsStampListener extends implementationOf(EventSubscriberInterface) {
        onMessageFailed(event: WorkerMessageFailedEvent): void;

        static getSubscribedEvents(): EventSubscriptions;
    }
}
