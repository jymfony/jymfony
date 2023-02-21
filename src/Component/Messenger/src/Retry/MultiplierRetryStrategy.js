const InvalidArgumentException = Jymfony.Component.Messenger.Exception.InvalidArgumentException;
const RedeliveryStamp = Jymfony.Component.Messenger.Stamp.RedeliveryStamp;
const RetryStrategyInterface = Jymfony.Component.Messenger.Retry.RetryStrategyInterface;

/**
 * A retry strategy with a constant or exponential retry delay.
 *
 * For example, if $delayMilliseconds=10000 & $multiplier=1 (default),
 * each retry will wait exactly 10 seconds.
 *
 * But if $delayMilliseconds=10000 & $multiplier=2:
 *      * Retry 1: 10 second delay
 *      * Retry 2: 20 second delay (10000 * 2 = 20000)
 *      * Retry 3: 40 second delay (20000 * 2 = 40000)
 *
 * @memberOf Jymfony.Component.Messenger.Retry
 * @final
 */
export default class MultiplierRetryStrategy extends implementationOf(RetryStrategyInterface) {
    /**
     * @param {int} [maxRetries = 3] The maximum number of times to retry
     * @param {int} [delayMilliseconds = 100] Amount of time to delay (or the initial value when multiplier is used)
     * @param {number} [multiplier = 1.0] Multiplier to apply to the delay each time a retry occurs
     * @param {int} [maxDelayMilliseconds = 0] Maximum delay to allow (0 means no maximum)
     */
    __construct(maxRetries = 3, delayMilliseconds = 1000, multiplier = 1.0, maxDelayMilliseconds = 0) {
        /**
         * @type {int}
         *
         * @private
         */
        this._maxRetries = maxRetries;

        if (0 > delayMilliseconds) {
            throw new InvalidArgumentException(__jymfony.sprintf('Delay must be greater than or equal to zero: "%s" given.', delayMilliseconds));
        }

        /**
         * @type {int}
         *
         * @private
         */
        this._delayMilliseconds = delayMilliseconds;

        if (1 > multiplier) {
            throw new InvalidArgumentException(__jymfony.sprintf('Multiplier must be greater than zero: "%s" given.', multiplier));
        }

        /**
         * @type {number}
         *
         * @private
         */
        this._multiplier = multiplier;

        if (0 > maxDelayMilliseconds) {
            throw new InvalidArgumentException(__jymfony.sprintf('Max delay must be greater than or equal to zero: "%s" given.', maxDelayMilliseconds));
        }

        /**
         * @type {int}
         *
         * @private
         */
        this._maxDelayMilliseconds = maxDelayMilliseconds;
    }

    /**
     * @inheritDoc
     */
    isRetryable(message) {
        const retries = RedeliveryStamp.getRetryCountFromEnvelope(message);

        return retries < this._maxRetries;
    }

    /**
     * @inheritDoc
     */
    getWaitingTime(message) {
        const retries = RedeliveryStamp.getRetryCountFromEnvelope(message);
        const delay = this._delayMilliseconds * this._multiplier ** retries;

        if (delay > this._maxDelayMilliseconds && 0 !== this._maxDelayMilliseconds) {
            return this._maxDelayMilliseconds;
        }

        return Math.ceil(delay);
    }
}
