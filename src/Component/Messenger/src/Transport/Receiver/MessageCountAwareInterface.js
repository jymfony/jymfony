/**
 * @memberOf Jymfony.Component.Messenger.Transport.Receiver
 */
class MessageCountAwareInterface {
    /**
     * Returns the number of messages waiting to be handled.
     *
     * In some systems, this may be an approximate number.
     *
     * @returns {int}
     */
    get messageCount() { }
}

export default getInterface(MessageCountAwareInterface);
