const ReceiverInterface = Jymfony.Component.Messenger.Transport.Receiver.ReceiverInterface;

/**
 * Used when a receiver has the ability to list messages and find specific messages.
 * A receiver that implements this should add the TransportMessageIdStamp
 * to the Envelopes that it returns.
 *
 * @memberOf Jymfony.Component.Messenger.Transport.Receiver
 */
class ListableReceiverInterface {
    /**
     * Returns all the messages (up to the limit) in this receiver.
     *
     * Messages should be given the same stamps as when using ReceiverInterface.get().
     *
     * @param {int | null} [limit = null]
     *
     * @returns {AsyncIterator<Jymfony.Component.Messenger.Envelope>}
     */
    async all(limit = null) { }

    /**
     * Returns the Envelope by id or none.
     *
     * Message should be given the same stamps as when using ReceiverInterface.get().
     *
     * @param {*} id
     *
     * @returns {Jymfony.Component.Messenger.Envelope | null}
     */
    async find(id) { }
}

export default getInterface(ListableReceiverInterface, ReceiverInterface);
