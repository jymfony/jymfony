const AbstractWorkerMessageEvent = Jymfony.Component.Messenger.Event.AbstractWorkerMessageEvent;

/**
 * Dispatched when a message was received from a transport but before sent to the bus.
 *
 * The event name is the class name.
 *
 * @memberOf Jymfony.Component.Messenger.Event
 * @final
 */
export default class WorkerMessageReceivedEvent extends AbstractWorkerMessageEvent {
    __construct(envelope, receiverName) {
        super.__construct(envelope, receiverName);

        /**
         * @type {boolean}
         *
         * @private
         */
        this._shouldHandle = true;
    }

    /**
     * @param {boolean | null} [shouldHandle = null]
     *
     * @return {boolean}
     */
    shouldHandle(shouldHandle = null) {
        if (null !== shouldHandle) {
            this._shouldHandle = shouldHandle;
        }

        return this._shouldHandle;
    }
}
