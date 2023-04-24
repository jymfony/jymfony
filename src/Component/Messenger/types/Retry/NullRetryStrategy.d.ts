declare namespace Jymfony.Component.Messenger.Retry {
    /**
     * A retry strategy to completely disable retry mechanism.
     *
     * @final
     */
    export class NullRetryStrategy extends implementationOf(RetryStrategyInterface) {
        /**
         * @inheritDoc
         */
        isRetryable(): boolean;

        /**
         * @inheritDoc
         */
        getWaitingTime(): number;
    }
}
