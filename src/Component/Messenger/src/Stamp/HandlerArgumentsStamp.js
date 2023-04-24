const NonSendableStampInterface = Jymfony.Component.Messenger.Stamp.NonSendableStampInterface;

/**
 * Marker telling that ack should not be done automatically for this message.
 *
 * @memberOf Jymfony.Component.Messenger.Stamp
 * @final
 */
export default class HandlerArgumentsStamp extends implementationOf(NonSendableStampInterface) {
    /**
     * Constructor.
     *
     * @param {*[]} additionalArguments
     */
    __construct(additionalArguments) {
        /**
         * @type {*[]}
         *
         * @private
         */
        this._additionalArguments = additionalArguments;
    }

    /**
     * @returns {*[]}
     */
    get additionalArguments() {
        return [ ...this._additionalArguments ];
    }
}
