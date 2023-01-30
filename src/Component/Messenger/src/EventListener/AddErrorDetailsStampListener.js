const EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
const WorkerMessageFailedEvent = Jymfony.Component.Messenger.Event.WorkerMessageFailedEvent;
const ErrorDetailsStamp = Jymfony.Component.Messenger.Stamp.ErrorDetailsStamp;

export default class AddErrorDetailsStampListener extends implementationOf(EventSubscriberInterface) {
    /**
     * @param {Jymfony.Component.Messenger.Event.WorkerMessageFailedEvent} event
     */
    onMessageFailed(event) {
        const stamp = ErrorDetailsStamp.create(event.throwable);
        const previousStamp = event.envelope.last(ErrorDetailsStamp);

        // Do not append duplicate information
        if (null === previousStamp || !previousStamp.equals(stamp)) {
            event.addStamps(stamp);
        }
    }

    static getSubscribedEvents() {
        return {
            // Must have higher priority than SendFailedMessageForRetryListener
            [ReflectionClass.getClassName(WorkerMessageFailedEvent)]: [ 'onMessageFailed', 200 ],
        };
    }
}
