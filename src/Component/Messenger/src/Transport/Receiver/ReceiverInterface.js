/**
 * @memberOf Jymfony.Component.Messenger.Transport.Receiver
 */
class ReceiverInterface {
    /**
     * Receives some messages.
     *
     * While this method could return an unlimited number of messages,
     * the intention is that it returns only one, or a "small number"
     * of messages each time. This gives the user more flexibility:
     * they can finish processing the one (or "small number") of messages
     * from this receiver and move on to check other receivers for messages.
     * If this method returns too many messages, it could cause a
     * blocking effect where handling the messages received from one
     * call to get() takes a long time, blocking other receivers from
     * being called.
     *
     * If applicable, the Envelope should contain a TransportMessageIdStamp.
     *
     * If a received message cannot be decoded, the message should not
     * be retried again (e.g. if there's a queue, it should be removed)
     * and a MessageDecodingFailedException should be thrown.
     *
     * @throws {Jymfony.Component.Messenger.Exception.TransportException} If there is an issue communicating with the transport
     *
     * @returns {Promise<Jymfony.Component.Messenger.Envelope[]>}
     */
    async get() { }

    /**
     * Acknowledges that the passed message was handled.
     *
     * @param {Jymfony.Component.Messenger.Envelope} envelope
     *
     * @throws {Jymfony.Component.Messenger.Exception.TransportException} If there is an issue communicating with the transport
     */
    async ack(envelope) { }

    /**
     * Called when handling the message failed, and it should not be retried.
     *
     * @param {Jymfony.Component.Messenger.Envelope} envelope
     *
     * @throws {Jymfony.Component.Messenger.Exception.TransportException} If there is an issue communicating with the transport
     */
    async reject(envelope) { }
}

export default getInterface(ReceiverInterface);
