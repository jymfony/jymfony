const NonSendableStampInterface = Jymfony.Component.Messenger.Stamp.NonSendableStampInterface;

/**
 * Marker telling that any batch handlers bound to the envelope should be flushed.
 *
 * @memberOf Jymfony.Component.Messenger.Stamp
 * @final
 */
export default class FlushBatchHandlersStamp extends implementationOf(NonSendableStampInterface) {
    /**
     * Constructor.
     *
     * @param {boolean} force
     */
    __construct(force) {
        /**
         * @type {boolean}
         *
         * @private
         */
        this._force = force;
    }

    /**
     * @returns {boolean}
     */
    get force() {
        return this._force;
    }
}
