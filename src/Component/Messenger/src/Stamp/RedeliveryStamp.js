const DateTime = Jymfony.Component.DateTime.DateTime;
const StampInterface = Jymfony.Component.Messenger.Stamp.StampInterface;

/**
 * Stamp applied when a messages needs to be redelivered.
 *
 * @memberOf Jymfony.Component.Messenger.Stamp
 * @final
 */
export default class RedeliveryStamp extends implementationOf(StampInterface) {
    /**
     * Constructor.
     *
     * @param {int} retryCount
     * @param {Jymfony.Contracts.DateTime.DateTimeInterface} [redeliveredAt = null]
     */
    __construct(retryCount, redeliveredAt = null) {
        /**
         * @type {int}
         *
         * @private
         */
        this._retryCount = retryCount;

        /**
         * @type {Jymfony.Contracts.DateTime.DateTimeInterface}
         *
         * @private
         */
        this._redeliveredAt = redeliveredAt || new DateTime();
    }

    /**
     * @param {Jymfony.Component.Messenger.Envelope} envelope
     *
     * @returns {int}
     */
    static getRetryCountFromEnvelope(envelope) {
        /** @type {Jymfony.Component.Messenger.Stamp.RedeliveryStamp|null} retryMessageStamp */
        const retryMessageStamp = envelope.last(__self);

        return null !== retryMessageStamp ? retryMessageStamp.retryCount : 0;
    }

    /**
     * @returns {int}
     */
    get retryCount() {
        return this._retryCount;
    }

    /**
     * @returns {Jymfony.Contracts.DateTime.DateTimeInterface}
     */
    get redeliveredAt() {
        return this._redeliveredAt;
    }
}
