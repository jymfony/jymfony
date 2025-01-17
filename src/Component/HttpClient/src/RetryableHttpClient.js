const AsyncResponse = Jymfony.Component.HttpClient.Response.AsyncResponse;
const DateTime = Jymfony.Component.DateTime.DateTime;
const GenericRetryStrategy = Jymfony.Component.HttpClient.Retry.GenericRetryStrategy;
const HttpClientInterface = Jymfony.Contracts.HttpClient.HttpClientInterface;
const NullLogger = Jymfony.Contracts.Logger.NullLogger;

/**
 * Automatically retries failing HTTP requests.
 *
 * @memberOf Jymfony.Component.HttpClient
 */
export default class RetryableHttpClient extends implementationOf(HttpClientInterface) {
    /**
     * @param {Jymfony.Contracts.HttpClient.HttpClientInterface} client The Http client to decorate
     * @param {Jymfony.Component.HttpClient.Retry.RetryStrategyInterface} strategy The retry strategy to use in case of error.
     * @param {int} maxRetries The maximum number of times to retry
     * @param {Jymfony.Contracts.Logger.LoggerInterface} logger
     */
    __construct(client, strategy = new GenericRetryStrategy(), maxRetries = 3, logger = new NullLogger()) {
        /**
         * @type {Jymfony.Contracts.HttpClient.HttpClientInterface}
         *
         * @private
         */
        this._client = client;

        /**
         * @type {Jymfony.Component.HttpClient.Retry.RetryStrategyInterface}
         *
         * @private
         */
        this._strategy = strategy;

        /**
         * @type {int}
         *
         * @private
         */
        this._maxRetries = maxRetries;

        /**
         * @type {Jymfony.Contracts.Logger.LoggerInterface}
         *
         * @private
         */
        this._logger = logger;
    }

    request(method, url, options = {}) {
        if (0 >= this._maxRetries) {
            return this._client.request(method, url, options);
        }

        const self = this;
        const asyncResponse = new AsyncResponse(this._client, method, url, options, async function ({ response, headers: getHeaders, streamer, passthru }) {
            let exception = null, headers = undefined;
            try {
                headers = await getHeaders();
            } catch (e) {
                exception = e;
            }

            if (null !== exception) {
                if ('' !== response.getInfo('primary_ip')) {
                    const shouldRetry = self._strategy.shouldRetry(response.getInfo(), null, exception);
                    if (null === shouldRetry) {
                        throw new LogicException(__jymfony.sprintf('The "%s.shouldRetry() method must not return null when called with an exception.', ReflectionClass.getClassName(self._strategy)));
                    }

                    if (false === shouldRetry) {
                        throw exception;
                    }
                }
            } else {
                let shouldRetry = self._strategy.shouldRetry(response.getInfo(), null, null);
                if (false === shouldRetry) {
                    return await streamer();
                }

                if (null === shouldRetry) {
                    // Body is needed to decide if retryable.
                    let stream = await streamer(false);
                    let buffer = stream;
                    if (stream instanceof __jymfony.StreamBuffer) {
                        buffer = stream.buffer;
                    }

                    if (! isBuffer(buffer)) {
                        stream = response._pipeline(stream, new __jymfony.StreamBuffer());
                        buffer = stream.buffer;
                    }

                    shouldRetry = self._strategy.shouldRetry(response.getInfo(), buffer, null);
                    if (null === shouldRetry) {
                        throw new LogicException(__jymfony.sprintf('The "%s.shouldRetry() method must not return null when called with a body.', ReflectionClass.getClassName(self._strategy)));
                    }

                    if (false === shouldRetry) {
                        return stream;
                    }
                }
            }

            let delay = self._getDelayFromHeader(headers);
            if (undefined === delay || null === delay) {
                delay = self._strategy.getDelay(response.getInfo(), response.getContent(false), exception);
            }

            const retryCount = response.getInfo('retry_count') + 1;
            response.setInfo('retry_count', retryCount);
            response.replaceRequest(method, url, options);

            self._logger.info('Try #{count} after {delay}ms' + (exception ? ': ' + exception.message : ', status code: ' + response.getStatusCode()), {
                count: retryCount,
                delay,
            });

            await __jymfony.sleep(delay);
            if (retryCount <= self._maxRetries) {
                return await passthru();
            }
        });

        asyncResponse.setInfo('retry_count', 0);

        return asyncResponse;
    }

    _getDelayFromHeader(headers) {
        const after = headers['retry-after'] ? (headers['retry-after'][0] || null) : null;
        if (null !== after) {
            if (isNumeric(after)) {
                return (~~after) * 1000;
            }

            try {
                return Math.max(0, (new DateTime(after)).timestamp - DateTime.unixTime) * 1000;
            } catch {
                // Do nothing.
            }
        }

        return null;
    }
}
