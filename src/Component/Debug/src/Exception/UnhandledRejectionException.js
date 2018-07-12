/**
 * Debug exception thrown when an unhandled rejection event is fired.
 *
 * @memberOf Jymfony.Component.Debug.Exception
 */
class UnhandledRejectionException extends RuntimeException {
    /**
     * Constructor.
     *
     * @param {Promise} promise
     * @param {Error} previous
     */
    __construct(promise, previous = undefined) {
        super.__construct('Unhandled rejection', null, previous);

        /**
         * The promise which was rejected.
         *
         * @type {Promise}
         * @private
         */
        this._promise = promise;
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

module.exports = UnhandledRejectionException;
