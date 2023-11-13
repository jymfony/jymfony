const AwsLambdaRunnerInterface = Jymfony.Component.Runtime.Runner.AwsLambdaRunnerInterface;

/**
 * @memberof Jymfony.Component.Runtime.Runner
 */
export default class AwsLambdaClosureRunner extends implementationOf(AwsLambdaRunnerInterface) {
    #closure;
    #event;
    #context;
    #stream;

    /**
     * @param {Function} closure
     */
    constructor(closure) {
        super();
        this.#closure = closure;
    }

    setEvent(event) {
        this.#event = event;
    }

    setContext(context) {
        this.#context = context;
    }

    setStreamingResponse(stream) {
        this.#stream = stream;
    }

    run() {
        return this.#closure(this.#event, this.#stream ?? this.#context, this.#context);
    }
}
