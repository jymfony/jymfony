/**
 * Dispatched after the worker processed a message or didn't receive a message at all.
 *
 * @memberOf Jymfony.Component.Messenger.Event
 * @final
 */
export default class WorkerRunningEvent {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Messenger.Worker} worker
     * @param {boolean} isWorkerIdle
     */
    __construct(worker, isWorkerIdle) {
        /**
         * @type {Jymfony.Component.Messenger.Worker}
         *
         * @private
         */
        this._worker = worker;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._isWorkerIdle = isWorkerIdle;
    }

    /**
     * @returns {Jymfony.Component.Messenger.Worker}
     */
    get worker() {
        return this._worker;
    }

    /**
     * Returns true when no message has been received by the worker.
     *
     * @returns {boolean}
     */
    get isWorkerIdle() {
        return this._isWorkerIdle;
    }
}
