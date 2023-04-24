const NonSendableStampInterface = Jymfony.Component.Messenger.Stamp.NonSendableStampInterface;

/**
 * Marker stamp identifying a message sent by the `SendMessageMiddleware`.
 *
 * @see Jymfony.Component.Messenger.Middleware.SendMessageMiddleware
 *
 * @memberOf Jymfony.Component.Messenger.Stamp
 * @final
 */
export default class SentStamp extends implementationOf(NonSendableStampInterface) {
    /**
     * Constructor.
     *
     * @param {string} senderClass
     * @param {string | null} [senderAlias = null]
     */
    __construct(senderClass, senderAlias = null) {
        /**
         * @type {string|null}
         *
         * @private
         */
        this._senderAlias = senderAlias;

        /**
         * @type {string}
         *
         * @private
         */
        this._senderClass = senderClass;
    }

    get senderClass() {
        return this._senderClass;
    }

    get senderAlias() {
        return this._senderAlias;
    }
}
