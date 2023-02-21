const RetryStrategyInterface = Jymfony.Component.Messenger.Retry.RetryStrategyInterface;

/**
 * A retry strategy to completely disable retry mechanism.
 *
 * @memberOf Jymfony.Component.Messenger.Retry
 * @final
 */
export default class NullRetryStrategy extends implementationOf(RetryStrategyInterface) {
    /**
     * @inheritDoc
     */
    isRetryable() {
        return false;
    }

    /**
     * @inheritDoc
     */
    getWaitingTime() {
        return 0;
    }
}
