const InvalidArgumentException = Jymfony.Component.Messenger.Exception.InvalidArgumentException;
const ReceivedStamp = Jymfony.Component.Messenger.Stamp.ReceivedStamp;
const SentStamp = Jymfony.Component.Messenger.Stamp.SentStamp;
const TransportInterface = Jymfony.Component.Messenger.Transport.TransportInterface;

/**
 * Transport that immediately marks messages as received and dispatches for handling.
 *
 * @memberOf Jymfony.Component.Messenger.Transport.Sync
 */
export default class SyncTransport extends implementationOf(TransportInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Messenger.MessageBusInterface} messageBus
     */
    __construct(messageBus) {
        /**
         * @type {Jymfony.Component.Messenger.MessageBusInterface}
         *
         * @private
         */
        this._messageBus = messageBus;
    }

    get() {
        throw new InvalidArgumentException('You cannot receive messages from the Messenger SyncTransport.');
    }

    stop() {
        throw new InvalidArgumentException('You cannot call stop() on the Messenger SyncTransport.');
    }

    ack() {
        throw new InvalidArgumentException('You cannot call ack() on the Messenger SyncTransport.');
    }

    reject() {
        throw new InvalidArgumentException('You cannot call reject() on the Messenger SyncTransport.');
    }

    send(envelope) {
        /** @type {Jymfony.Component.Messenger.Stamp.SentStamp|null} */
        const sentStamp = envelope.last(SentStamp);
        const alias = null === sentStamp ? 'sync' : (sentStamp.senderAlias || sentStamp.senderClass);

        envelope = envelope.withStamps(new ReceivedStamp(alias));

        return this._messageBus.dispatch(envelope);
    }
}
