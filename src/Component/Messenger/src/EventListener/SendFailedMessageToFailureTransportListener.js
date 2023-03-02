const DelayStamp = Jymfony.Component.Messenger.Stamp.DelayStamp;
const EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
const NullLogger = Jymfony.Contracts.Logger.NullLogger;
const RedeliveryStamp = Jymfony.Component.Messenger.Stamp.RedeliveryStamp;
const SentToFailureTransportStamp = Jymfony.Component.Messenger.Stamp.SentToFailureTransportStamp;
const WorkerMessageFailedEvent = Jymfony.Component.Messenger.Event.WorkerMessageFailedEvent;

/**
 * Sends a rejected message to a "failure transport".
 *
 * @memberOf Jymfony.Component.Messenger.EventListener
 */
export default class SendFailedMessageToFailureTransportListener extends implementationOf(EventSubscriberInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerInterface} failureSenders
     * @param {Jymfony.Contracts.Logger.LoggerInterface} logger
     */
    __construct(failureSenders, logger = null) {
        /**
         * @type {Jymfony.Component.DependencyInjection.ContainerInterface}
         *
         * @private
         */
        this._failureSenders = failureSenders;

        /**
         * @type {Jymfony.Contracts.Logger.LoggerInterface}
         *
         * @private
         */
        this._logger = logger || new NullLogger();
    }

    /**
     * @param {Jymfony.Component.Messenger.Event.WorkerMessageFailedEvent} event
     */
    async onMessageFailed(event) {
        if (event.willRetry) {
            return;
        }

        if (! this._failureSenders.has(event.receiverName)) {
            return;
        }

        const failureSender = this._failureSenders.get(event.receiverName);
        let envelope = event.envelope;

        // Avoid re-sending to the failed sender
        if (null !== envelope.last(SentToFailureTransportStamp)) {
            return;
        }

        envelope = envelope.withStamps(
            new SentToFailureTransportStamp(event.receiverName),
            new DelayStamp(0),
            new RedeliveryStamp(0)
        );

        this._logger.info('Rejected message {class} will be sent to the failure transport {transport}.', {
            'class': ReflectionClass.getClassName(envelope.message),
            transport: ReflectionClass.getClassName(failureSender),
        });

        await failureSender.send(envelope);
    }

    static getSubscribedEvents() {
        return {
            [ReflectionClass.getClassName(WorkerMessageFailedEvent)]: [ 'onMessageFailed', -100 ],
        };
    }
}
