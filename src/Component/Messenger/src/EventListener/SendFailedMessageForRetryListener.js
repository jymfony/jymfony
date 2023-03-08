const DelayStamp = Jymfony.Component.Messenger.Stamp.DelayStamp;
const EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
const HandlerFailedException = Jymfony.Component.Messenger.Exception.HandlerFailedException;
const RecoverableExceptionInterface = Jymfony.Component.Messenger.Exception.RecoverableExceptionInterface;
const RedeliveryStamp = Jymfony.Component.Messenger.Stamp.RedeliveryStamp;
const UnrecoverableExceptionInterface = Jymfony.Component.Messenger.Exception.UnrecoverableExceptionInterface;
const WorkerMessageFailedEvent = Jymfony.Component.Messenger.Event.WorkerMessageFailedEvent;
const WorkerMessageRetriedEvent = Jymfony.Component.Messenger.Event.WorkerMessageRetriedEvent;

/**
 * @memberOf Jymfony.Component.Messenger.EventListener
 */
export default class SendFailedMessageForRetryListener extends implementationOf(EventSubscriberInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.DependencyInjection.ContainerInterface} sendersLocator
     * @param {Jymfony.Contracts.DependencyInjection.ContainerInterface} retryStrategyLocator
     * @param {Jymfony.Contracts.Logger.LoggerInterface | null} [logger = null]
     * @param {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface | null} [eventDispatcher = null]
     * @param {int} [historySize = 10]
     */
    __construct(sendersLocator, retryStrategyLocator, logger = null, eventDispatcher = null, historySize = 10) {
        /**
         * @type {Jymfony.Contracts.DependencyInjection.ContainerInterface}
         *
         * @private
         */
        this._sendersLocator = sendersLocator;

        /**
         * @type {Jymfony.Contracts.DependencyInjection.ContainerInterface}
         *
         * @private
         */
        this._retryStrategyLocator = retryStrategyLocator;

        /**
         * @type {Jymfony.Contracts.Logger.LoggerInterface | null}
         *
         * @private
         */
        this._logger = logger;

        /**
         * @type {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface | null}
         *
         * @private
         */
        this._eventDispatcher = eventDispatcher;

        /**
         * @type {int}
         *
         * @private
         */
        this._historySize = historySize;
    }

    /**
     * @param {Jymfony.Component.Messenger.Event.WorkerMessageFailedEvent} event
     *
     * @returns {Promise<void>}
     */
    async onMessageFailed(event) {
        const retryStrategy = this._getRetryStrategyForTransport(event.receiverName);
        const { envelope, throwable } = event;

        const message = envelope.message;
        const context = {
            'class': ReflectionClass.getClassName(message),
        };

        const shouldRetry = null !== retryStrategy && this._shouldRetry(throwable, envelope, retryStrategy);

        let retryCount = RedeliveryStamp.getRetryCountFromEnvelope(envelope);
        if (shouldRetry) {
            event.setForRetry();

            ++retryCount;

            const delay = retryStrategy.getWaitingTime(envelope, throwable);

            if (null !== this._logger) {
                this._logger.warning('Error thrown while handling message {class}. Sending for retry #{retryCount} using {delay} ms delay. Error: "{error}"', { ...context, retryCount, delay, error: throwable.message, exception: throwable });
            }

            // Add the delay and retry stamp info
            const retryEnvelope = this._withLimitedHistory(envelope, new DelayStamp(delay), new RedeliveryStamp(retryCount));

            // Re-send the message for retry
            await this._getSenderForTransport(event.receiverName).send(retryEnvelope);

            if (null !== this._eventDispatcher) {
                await this._eventDispatcher.dispatch(new WorkerMessageRetriedEvent(retryEnvelope, event.receiverName));
            }
        } else {
            if (null !== this._logger) {
                this._logger.critical('Error thrown while handling message {class}. Removing from transport after {retryCount} retries. Error: "{error}"', { ...context, retryCount, error: throwable.message, exception: throwable });
            }
        }
    }

    /**
     * Adds stamps to the envelope by keeping only the First + Last N stamps.
     *
     * @param {Jymfony.Component.Messenger.Envelope} envelope
     * @param {Jymfony.Component.Messenger.Stamp.StampInterface} stamps
     *
     * @returns {Jymfony.Component.Messenger.Envelope}
     *
     * @private
     */
    _withLimitedHistory(envelope, ...stamps) {
        for (const stamp of stamps) {
            let history = envelope.all(ReflectionClass.getClassName(stamp));
            if (history.length < this._historySize) {
                envelope = envelope.withStamps(stamp);
                continue;
            }

            history = [ history[0], history.slice(history.length - this._historySize + 2), stamp ];
            envelope = envelope.withoutAllStamps(ReflectionClass.getClassName(stamp)).withStamps(...history);
        }

        return envelope;
    }

    static getSubscribedEvents() {
        return {
            // Must have higher priority than SendFailedMessageToFailureTransportListener
            [ReflectionClass.getClassName(WorkerMessageFailedEvent)]: [ 'onMessageFailed', 100 ],
        };
    }

    /**
     * @param {Error} e
     * @param {Jymfony.Component.Messenger.Envelope} envelope
     * @param {Jymfony.Component.Messenger.Retry.RetryStrategyInterface} retryStrategy
     *
     * @returns {boolean}
     *
     * @private
     */
    _shouldRetry(e, envelope, retryStrategy) {
        if (e instanceof RecoverableExceptionInterface) {
            return true;
        }

        // If one or more nested Exceptions is an instance of RecoverableExceptionInterface we should retry
        // If ALL nested Exceptions are an instance of UnrecoverableExceptionInterface we should not retry
        if (e instanceof HandlerFailedException) {
            let shouldNotRetry = true;
            for (const nestedException of e.nestedExceptions) {
                if (nestedException instanceof RecoverableExceptionInterface) {
                    return true;
                }

                if (! (nestedException instanceof UnrecoverableExceptionInterface)) {
                    shouldNotRetry = false;
                    break;
                }
            }
            if (shouldNotRetry) {
                return false;
            }
        }

        if (e instanceof UnrecoverableExceptionInterface) {
            return false;
        }

        return retryStrategy.isRetryable(envelope, e);
    }

    /**
     * @param {string} alias
     *
     * @returns {Jymfony.Component.Messenger.Retry.RetryStrategyInterface | null}
     *
     * @private
     */
    _getRetryStrategyForTransport(alias) {
        if (this._retryStrategyLocator.has(alias)) {
            return this._retryStrategyLocator.get(alias);
        }

        return null;
    }

    /**
     * @param {string} alias
     *
     * @returns {Jymfony.Component.Messenger.Transport.Sender.SenderInterface}
     *
     * @private
     */
    _getSenderForTransport(alias) {
        if (this._sendersLocator.has(alias)) {
            return this._sendersLocator.get(alias);
        }

        throw new RuntimeException(__jymfony.sprintf('Could not find sender "%s" based on the same receiver to send the failed message to for retry.', alias));
    }
}
