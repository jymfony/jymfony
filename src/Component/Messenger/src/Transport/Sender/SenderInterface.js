/**
 * @memberOf Jymfony.Component.Messenger.Transport.Sender
 */
export default class SenderInterface {
    /**
     * Sends the given envelope.
     *
     * The sender can read different stamps for transport configuration,
     * like delivery delay.
     *
     * If applicable, the returned Envelope should contain a TransportMessageIdStamp.
     *
     * @param {Jymfony.Component.Messenger.Envelope} envelope
     *
     * @returns {Promise<Jymfony.Component.Messenger.Envelope>}
     */
    async send(envelope) { }
}
