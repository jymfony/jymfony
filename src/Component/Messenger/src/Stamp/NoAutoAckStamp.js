const NonSendableStampInterface = Jymfony.Component.Messenger.Stamp.NonSendableStampInterface;

/**
 * Marker telling that ack should not be done automatically for this message.
 *
 * @memberOf Jymfony.Component.Messenger.Stamp
 * @final
 */
export default class NoAutoAckStamp extends implementationOf(NonSendableStampInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Messenger.Handler.HandlerDescriptor} handlerDescriptor
     */
    __construct(handlerDescriptor) {
        /**
         * @type {Jymfony.Component.Messenger.Handler.HandlerDescriptor}
         *
         * @private
         */
        this._handlerDescriptor = handlerDescriptor;
    }

    /**
     * @returns {Jymfony.Component.Messenger.Handler.HandlerDescriptor}
     */
    get handlerDescriptor() {
        return this._handlerDescriptor;
    }
}
