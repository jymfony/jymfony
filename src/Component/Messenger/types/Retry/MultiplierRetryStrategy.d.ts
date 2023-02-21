declare namespace Jymfony.Component.Messenger.Retry {
    import Envelope = Jymfony.Component.Messenger.Envelope;

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
     * @final
     */
    export class MultiplierRetryStrategy extends implementationOf(RetryStrategyInterface) {
        private _maxRetries: number;
        private _delayMilliseconds: number;
        private _multiplier: number;
        private _maxDelayMilliseconds: number;

        /**
         * @param [maxRetries = 3] The maximum number of times to retry
         * @param [delayMilliseconds = 100] Amount of time to delay (or the initial value when multiplier is used)
         * @param [multiplier = 1.0] Multiplier to apply to the delay each time a retry occurs
         * @param [maxDelayMilliseconds = 0] Maximum delay to allow (0 means no maximum)
         */
        __construct(maxRetries?: number, delayMilliseconds?: number, multiplier?: number, maxDelayMilliseconds?: number): void;
        constructor(maxRetries?: number, delayMilliseconds?: number, multiplier?: number, maxDelayMilliseconds?: number);

        /**
         * @inheritDoc
         */
        isRetryable(message: Envelope): boolean;

        /**
         * @inheritDoc
         */
        getWaitingTime(message: Envelope): number;
    }
}
