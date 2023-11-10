const RunnerInterface = Jymfony.Component.Runtime.RunnerInterface;

/**
 * Describe a runner aware of aws lambda context.
 *
 * @memberof Jymfony.Component.Runtime.Runner.Jymfony
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
}

export default getInterface(AwsLambdaRunnerInterface);
