/**
 * Debug exception thrown when promise has been resolved or rejected multiple times.
 *
 * @memberOf Jymfony.Component.Debug.Exception
 */
class MultipleResolvesException extends RuntimeException {
    /**
     * Constructor.
     *
     * @param {string} type
     * @param {Promise} promise
     * @param {*} value
     */
    __construct(type, promise, value) {
        const message = 'Promise ' + type + 'd multiple times.';
        super.__construct(message);

        /**
         * The promise which was rejected.
         *
         * @type {Promise}
         *
         * @private
         */
        this._promise = promise;

        /**
         * The value with which the promise was either resolved or rejected after the original resolve.
         *
         * @type {*}
         *
         * @private
         */
        this._value = value;
    }

    /**
     * Gets the rejected promise.
     *
     * @returns {Promise}
     */
    get promise() {
        return this._promise;
    }

    /**
     * The value with which the promise was either resolved or rejected after the original resolve.
     *
     * @returns {*}
     */
    get value() {
        return this._value;
    }
}

module.exports = MultipleResolvesException;
