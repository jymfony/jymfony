declare namespace Jymfony.Component.Runtime.Runner {
    import RunnerInterface = Jymfony.Component.Runtime.RunnerInterface;

    /**
     * Describe a runner aware of aws lambda context.
     */
    class AwsLambdaRunnerInterface extends RunnerInterface.definition {
        public static readonly definition: Newable<AwsLambdaRunnerInterface>;

        /**
         * Sets the lambda event.
         */
        setEvent(event: object): void;

        /**
         * Sets the lambda context.
         */
        setContext(context: object): void;

        /**
         * Sets the streaming response (if any).
         */
        setStreamingResponse(stream: object): void;
    }
}
