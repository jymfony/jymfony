const StampInterface = Jymfony.Component.Messenger.Stamp.StampInterface;

/**
 * Stamp used to identify which bus it was passed to.
 *
 * @memberOf Jymfony.Component.Messenger.Stamp
 */
export default class BusNameStamp extends implementationOf(StampInterface) {
    /**
     * Constructor.
     *
     * @param {string} busName
     */
    __construct(busName) {
        /**
         * @type {string}
         *
         * @private
         */
        this._busName = busName;
    }

    /**
     * @returns {string}
     */
    get busName() {
        return this._busName;
    }
}
