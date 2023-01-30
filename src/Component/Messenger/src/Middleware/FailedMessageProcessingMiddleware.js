const MiddlewareInterface = Jymfony.Component.Messenger.Middleware.MiddlewareInterface;
const ReceivedStamp = Jymfony.Component.Messenger.Stamp.ReceivedStamp;
const SentToFailureTransportStamp = Jymfony.Component.Messenger.Stamp.SentToFailureTransportStamp;

/**
 * @memberOf Jymfony.Component.Messenger.Middleware
 */
export default class FailedMessageProcessingMiddleware extends implementationOf(MiddlewareInterface) {
    handle(envelope, stack) {
        // Look for "received" messages decorated with the SentToFailureTransportStamp
        /** @type {Jymfony.Component.Messenger.Stamp.SentToFailureTransportStamp | null} sentToFailureStamp */
        const sentToFailureStamp = envelope.last(SentToFailureTransportStamp);
        if (null !== sentToFailureStamp && null !== envelope.last(ReceivedStamp)) {
            // Mark the message as "received" from the original transport
            // This guarantees the same behavior as when originally received
            envelope = envelope.withStamps(new ReceivedStamp(sentToFailureStamp.originalReceiverName));
        }

        return stack.next().handle(envelope, stack);
    }
}
