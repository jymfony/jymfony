const NonSendableStampInterface = Jymfony.Component.Messenger.Stamp.NonSendableStampInterface;

/**
 * Marker stamp for messages that can be ack/nack'ed.
 *
 * @memberOf Jymfony.Component.Messenger.Stamp
 * @final
 */
export default class AckStamp extends implementationOf(NonSendableStampInterface) {
    /**
     * Constructor.
     *
     * @param {function(Jymfony.Component.Messenger.Envelope, Error|null): Promise<void>} ack
     */
    __construct(ack) {
        /**
         * @type {function(Jymfony.Component.Messenger.Envelope, (Error|null)): Promise<void>}
         *
         * @private
         */
        this._ack = ack;
    }

    async ack(envelope, e = null) {
        await this._ack(envelope, e);
    }
}
