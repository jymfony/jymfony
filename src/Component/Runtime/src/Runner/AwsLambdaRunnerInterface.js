const RunnerInterface = Jymfony.Component.Runtime.RunnerInterface;

/**
 * Describe a runner aware of aws lambda context.
 *
 * @memberof Jymfony.Component.Runtime.Runner
 */
class AwsLambdaRunnerInterface extends RunnerInterface.definition {
    /**
     * Sets the lambda event.
     *
     * @param {object} event
     */
    setEvent(event) { }

    /**
     * Sets the lambda context.
     *
     * @param context
     */
    setContext(context) { }

    /**
     * Sets the streaming response (if any).
     *
     * @param stream
     */
    setStreamingResponse(stream) { }
}

export default getInterface(AwsLambdaRunnerInterface);
