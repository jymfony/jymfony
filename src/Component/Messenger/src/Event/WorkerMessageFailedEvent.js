const AbstractWorkerMessageEvent = Jymfony.Component.Messenger.Event.AbstractWorkerMessageEvent;

/**
 * Dispatched when a message was received from a transport and handling failed.
 *
 * The event name is the class name.
 *
 * @memberOf Jymfony.Component.Messenger.Event
 */
export default class WorkerMessageFailedEvent extends AbstractWorkerMessageEvent {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Messenger.Envelope} envelope
     * @param {string} receiverName
     * @param {Error} error
     */
    __construct(envelope, receiverName, error) {
        /**
         * @type {Error}
         *
         * @private
         */
        this._throwable = error;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._willRetry = false;

        super.__construct(envelope, receiverName);
    }

    /**
     * @returns {Error}
     */
    get throwable() {
        return this._throwable;
    }

    /**
     * @returns {boolean}
     */
    get willRetry() {
        return this._willRetry;
    }

    setForRetry() {
        this._willRetry = true;
    }
}
