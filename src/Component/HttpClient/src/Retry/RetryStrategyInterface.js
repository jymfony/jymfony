/**
 * @memberOf Jymfony.Component.HttpClient.Retry
 */
class RetryStrategyInterface {
    /**
     * Returns whether the request should be retried.
     *
     * @param {Object.<string, *>} responseInfo The response info object
     * @param {null|string} responseContent Null is passed when the body did not arrive yet
     * @param {Error} exception The error causing the retry.
     *
     * @returns {null|boolean} Returns null to signal that the body is required to take a decision
     */
    shouldRetry(responseInfo, responseContent, exception) { }

    /**
     * Returns the time to wait in milliseconds.
     *
     * @param {Object.<string, *>} responseInfo The response info object
     * @param {null|string} responseContent Null is passed when the body did not arrive yet
     * @param {Error} exception The error causing the retry.
     *
     * @returns {int} The time to wait for retry in milliseconds.
     */
    getDelay(responseInfo, responseContent, exception) { }
}

export default getInterface(RetryStrategyInterface);
