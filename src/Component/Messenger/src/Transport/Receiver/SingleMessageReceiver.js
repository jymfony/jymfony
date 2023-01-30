const ReceiverInterface = Jymfony.Component.Messenger.Transport.Receiver.ReceiverInterface;

/**
 * Receiver that decorates another, but receives only 1 specific message.
 *
 * @memberOf Jymfony.Component.Messenger.Transport.Receiver
 *
 * @internal
 */
export default class SingleMessageReceiver extends implementationOf(ReceiverInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Messenger.Transport.Receiver.ReceiverInterface} receiver
     * @param {Jymfony.Component.Messenger.Envelope} envelope
     */
    __construct(receiver, envelope) {
        /**
         * @type {Jymfony.Component.Messenger.Transport.Receiver.ReceiverInterface}
         *
         * @private
         */
        this._receiver = receiver;

        /**
         * @type {Jymfony.Component.Messenger.Envelope}
         *
         * @private
         */
        this._envelope = envelope;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._hasReceived = false;
    }

    get() {
        if (this._hasReceived) {
            return [];
        }

        this._hasReceived = true;

        return [ this._envelope ];
    }

    ack(envelope) {
        return this._receiver.ack(envelope);
    }

    reject(envelope) {
        return this._receiver.reject(envelope);
    }
}
