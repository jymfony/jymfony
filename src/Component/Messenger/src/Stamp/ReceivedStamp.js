const NonSendableStampInterface = Jymfony.Component.Messenger.Stamp.NonSendableStampInterface;

/**
 * Marker stamp for a received message.
 *
 * This is mainly used by the `SendMessageMiddleware` middleware to identify
 * a message should not be sent if it was just received.
 *
 * @see {Jymfony.Component.Messenger.Middleware.SendMessageMiddleware}
 *
 * @memberOf Jymfony.Component.Messenger.Stamp
 * @final
 */
export default class ReceivedStamp extends implementationOf(NonSendableStampInterface) {
    /**
     * Constructor.
     *
     * @param {string} transportName
     */
    __construct(transportName) {
        /**
         * @type {string}
         *
         * @private
         */
        this._transportName = transportName;
    }

    /**
     * @returns {string}
     */
    get transportName() {
        return this._transportName;
    }
}
