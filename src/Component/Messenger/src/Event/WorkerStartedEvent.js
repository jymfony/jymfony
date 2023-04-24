/**
 * Dispatched when a worker has been started.
 *
 * @memberOf Jymfony.Component.Messenger.Event
 */
export default class WorkerStartedEvent {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Messenger.Worker} worker
     */
    __construct(worker) {
        /**
         * @type {Jymfony.Component.Messenger.Worker}
         *
         * @private
         */
        this._worker = worker;
    }

    /**
     * @returns {Jymfony.Component.Messenger.Worker}
     */
    get worker() {
        return this._worker;
    }
}
