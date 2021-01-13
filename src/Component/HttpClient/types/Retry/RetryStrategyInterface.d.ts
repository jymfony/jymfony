declare namespace Jymfony.Component.HttpClient.Retry {
    class RetryStrategyInterface {
        /**
         * Returns whether the request should be retried.
         *
         * @param responseInfo The response info object
         * @param responseContent Null is passed when the body did not arrive yet
         * @param exception The error causing the retry.
         *
         * @returns Returns null to signal that the body is required to take a decision
         */
        shouldRetry(responseInfo: Record<string, any>, responseContent: null | string, exception: Error): null | boolean;

        /**
         * Returns the time to wait in milliseconds.
         *
         * @param responseInfo The response info object
         * @param responseContent Null is passed when the body did not arrive yet
         * @param exception The error causing the retry.
         *
         * @returns The time to wait for retry in milliseconds.
         */
        getDelay(responseInfo: Record<string, any>, responseContent: null | string, exception: Error): number;
    }
}
