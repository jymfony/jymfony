/**
 * @memberOf Jymfony.Component.Messenger.Retry
 */
class RetryStrategyInterface {
    /**
     * @param {Jymfony.Component.Messenger.Envelope} message
     * @param {Error | null} [throwable = null] The cause of the failed handling
     *
     * @returns {boolean}
     */
    isRetryable(message, throwable = null) { }

    /**
     * @param {Jymfony.Component.Messenger.Envelope} message
     * @param {Error | null} [throwable = null] The cause of the failed handling
     *
     * @returns {number} The time to delay/wait in milliseconds
     */
    getWaitingTime(message, throwable = null) { }
}

export default getInterface(RetryStrategyInterface);
