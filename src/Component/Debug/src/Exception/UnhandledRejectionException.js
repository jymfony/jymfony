const util = require('util');

/**
 * Debug exception thrown when an unhandled rejection event is fired.
 *
 * @memberOf Jymfony.Component.Debug.Exception
 */
export default class UnhandledRejectionException extends RuntimeException {
    /**
     * Constructor.
     *
     * @param {Promise} promise
     * @param {Error} previous
     */
    __construct(promise, previous = undefined) {
        let message = 'Unhandled promise rejection';
        if (previous instanceof Error) {
            message += ': ' + previous.toString();
        } else {
            message += '\nA non-Error object has been thrown to reject the promise\n\n';
            message += util.inspect(previous, {
                showProxy: true,
                showHidden: true,
            });
        }

        super.__construct(message, null, previous instanceof Error ? previous : undefined);

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
