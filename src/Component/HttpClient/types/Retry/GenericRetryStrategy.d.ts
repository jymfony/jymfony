const RetryStrategyInterface = Jymfony.Component.HttpClient.Retry.RetryStrategyInterface;

/**
 * Decides to retry the request when HTTP status codes belong to the given list of codes.
 *
 * @memberOf Jymfony.Component.HttpClient.Retry
 */
export default class GenericRetryStrategy extends implementationOf(RetryStrategyInterface) {
    /**
     * @param {Object.<number, string[]|boolean>} statusCodes List of HTTP status codes that trigger a retry
     * @param {int} delayMs Amount of time to delay (or the initial value when multiplier is used)
     * @param {float} multiplier Multiplier to apply to the delay each time a retry occurs
     * @param {int} maxDelayMs Maximum delay to allow (0 means no maximum)
     */
    __construct(statusCodes = __self.DEFAULT_RETRY_STATUS_CODES, delayMs = 1000, multiplier = 2.0, maxDelayMs = 0) {
        /**
         * @type {Object<number, string[]|boolean>}
         *
         * @private
         */
        this._statusCodes = statusCodes;

        /**
         * @type {int[]}
         *
         * @private
         */
        this._codes = Object.keys(this._statusCodes).map(Number);

        if (0 > delayMs) {
            throw new InvalidArgumentException(__jymfony.sprintf('Delay must be greater than or equal to zero: "%s" given.', delayMs));
        }

        /**
         * @type {int}
         *
         * @private
         */
        this._delayMs = delayMs;

        if (1 > multiplier) {
            throw new InvalidArgumentException(__jymfony.sprintf('Multiplier must be greater than or equal to one: "%s" given.', multiplier));
        }

        /**
         * @type {float}
         *
         * @private
         */
        this._multiplier = multiplier;

        if (0 > maxDelayMs) {
            throw new InvalidArgumentException(__jymfony.sprintf('Max delay must be greater than or equal to zero: "%s" given.', maxDelayMs));
        }

        /**
         * @type {int}
         *
         * @private
         */
        this._maxDelayMs = maxDelayMs;
    }

    /**
     * @inheritdoc
     */
    shouldRetry(responseInfo, responseContent, exception) {
        const statusCode = responseInfo.http_code || 0;
        if (this._codes.includes(statusCode) && isBoolean(this._statusCodes[statusCode])) {
            return this._statusCodes[statusCode];
        }

        if (isArray(this._statusCodes[statusCode])) {
            return this._statusCodes[statusCode].includes(responseInfo.http_method);
        }

        if (! exception) {
            return false;
        }

        if (this._codes.includes(0) && isBoolean(this._statusCodes[0])) {
            return this._statusCodes[0];
        }

        if (isArray(this._statusCodes[0])) {
            return this._statusCodes[0].includes(responseInfo.http_method);
        }

        return false;
    }

    /**
     * @inheritdoc
     */
    getDelay(responseInfo) {
        const delay = this._delayMs * this._multiplier ** responseInfo.retry_count;
        if (delay > this._maxDelayMs && 0 !== this._maxDelayMs) {
            return this._maxDelayMs;
        }

        return ~~delay;
    }
}

Object.defineProperty(GenericRetryStrategy, 'IDEMPOTENT_METHODS', { writable: false, configurable: false, value: [ 'GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'TRACE' ] });
Object.defineProperty(GenericRetryStrategy, 'DEFAULT_RETRY_STATUS_CODES', { writable: false, configurable: false, value: {
    0: GenericRetryStrategy.IDEMPOTENT_METHODS, // For transport exceptions
    423: true,
    425: true,
    429: true,
    500: GenericRetryStrategy.IDEMPOTENT_METHODS,
    502: true,
    503: true,
    504: GenericRetryStrategy.IDEMPOTENT_METHODS,
    507: GenericRetryStrategy.IDEMPOTENT_METHODS,
    510: GenericRetryStrategy.IDEMPOTENT_METHODS,
}});
