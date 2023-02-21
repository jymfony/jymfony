declare namespace Jymfony.Component.Messenger.Retry {
    import Envelope = Jymfony.Component.Messenger.Envelope;

    export class RetryStrategyInterface {
        public static readonly definition: Newable<RetryStrategyInterface>;

        /**
         * @param [throwable = null] The cause of the failed handling
         */
        isRetryable(message: Envelope, throwable?: Error | null): boolean;

        /**
         * @param [throwable = null] The cause of the failed handling
         *
         * @returns The time to delay/wait in milliseconds
         */
        getWaitingTime(message: Envelope, throwable?: Error | null): number;
    }
}
