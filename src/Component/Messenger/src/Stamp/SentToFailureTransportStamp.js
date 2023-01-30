const StampInterface = Jymfony.Component.Messenger.Stamp.StampInterface;

/**
 * Stamp applied when a message is sent to the failure transport.
 *
 * @memberOf Jymfony.Component.Messenger.Stamp
 * @final
 */
export default class SentToFailureTransportStamp extends implementationOf(StampInterface) {
    /**
     * Constructor.
     *
     * @param {string} originalReceiverName
     */
    __construct(originalReceiverName) {
        /**
         * @type {string}
         *
         * @private
         */
        this._originalReceiverName = originalReceiverName;
    }

    /**
     * @returns {string}
     */
    get originalReceiverName() {
        return this._originalReceiverName;
    }
}
