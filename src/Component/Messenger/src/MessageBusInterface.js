/**
 * @memberOf Jymfony.Component.Messenger
 */
class MessageBusInterface
{
    /**
     * Dispatches the given message.
     *
     * @param {object|Jymfony.Component.Messenger.Envelope}  message The message or the message pre-wrapped in an envelope
     * @param {Jymfony.Component.Messenger.Stamp.StampInterface[]} [stamps]
     *
     * @returns {Promise<Jymfony.Component.Messenger.Envelope>}
     */
    async dispatch(message, stamps = []) { }
}

export default getInterface(MessageBusInterface);
