/**
 * @memberOf Jymfony.Component.Messenger.Event
 * @abstract
 */
export default class AbstractWorkerMessageEvent {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Messenger.Envelope} envelope
     * @param {string} receiverName
     */
    __construct(envelope, receiverName) {
        /**
         * @type {Jymfony.Component.Messenger.Envelope}
         *
         * @private
         */
        this._envelope = envelope;

        /**
         * @type {string}
         *
         * @private
         */
        this._receiverName = receiverName;
    }

    /**
     * @returns {Jymfony.Component.Messenger.Envelope}
     */
    get envelope() {
        return this._envelope;
    }

    /**
     * Returns a unique identifier for transport receiver this message was received from.
     *
     * @returns {string}
     */
    get receiverName() {
        return this._receiverName;
    }

    /**
     * @param {Jymfony.Component.Messenger.Stamp.StampInterface} stamps
     */
    addStamps(...stamps) {
        this._envelope = this._envelope.withStamps(...stamps);
    }
}
