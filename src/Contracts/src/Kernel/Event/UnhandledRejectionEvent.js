const Event = Jymfony.Contracts.EventDispatcher.Event;

/**
 * Event triggered on unhandled promise rejection.
 *
 * @memberOf Jymfony.Contracts.Kernel.Event
 */
export default class UnhandledRejectionEvent extends Event {
    /**
     * Constructor.
     *
     * @param {Error} reason
     * @param {Promise} promise
     */
    __construct(reason, promise) {
        super.__construct();

        /**
         * @type {Error}
         *
         * @private
         */
        this._reason = reason;

        /**
         * @type {Promise}
         *
         * @private
         */
        this._promise = promise;
    }

    /**
     * Gets the unhandled error.
     *
     * @returns {Error}
     */
    get reason() {
        return this._reason;
    }

    /**
     * Gets the rejected promise.
     *
     * @returns {Promise}
     */
    get promise() {
        return this._promise;
    }
}
