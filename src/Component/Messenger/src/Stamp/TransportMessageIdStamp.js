const StampInterface = Jymfony.Component.Messenger.Stamp.StampInterface;

/**
 * Added by a sender or receiver to indicate the id of this message in that transport.
 *
 * @memberOf Jymfony.Component.Messenger.Stamp
 * @final
 */
export default class TransportMessageIdStamp extends implementationOf(StampInterface) {
    /**
     * Constructor.
     *
     * @param {*} id some "identifier" of the message in a transport
     */
    __construct(id) {
        /**
         * @type {*}
         *
         * @private
         */
        this._id = id;
    }

    /**
     * @returns {*}
     */
    get id() {
        return this._id;
    }
}
