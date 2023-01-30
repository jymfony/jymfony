/**
 * Maps a message to a list of senders.
 *
 * @memberOf Jymfony.Component.Messenger.Transport.Sender
 */
class SendersLocatorInterface {
    /**
     * Gets the senders for the given message name.
     *
     * @param {Jymfony.Component.Messenger.Envelope} envelope
     *
     * @returns {Object.<string, Jymfony.Component.Messenger.Transport.Sender.SenderInterface>} Indexed by sender alias if available
     */
    getSenders(envelope) { }
}

export default getInterface(SendersLocatorInterface);
