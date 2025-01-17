const AwsLambdaRunnerInterface = Jymfony.Component.Runtime.Runner.AwsLambdaRunnerInterface;

/**
 * @memberof Jymfony.Component.Runtime.Runner
 */
export default class AwsLambdaHandlerRunner extends implementationOf(AwsLambdaRunnerInterface) {
    /**
     * @type {Jymfony.Component.HttpServer.Serverless.AwsLambdaHandler}
     */
    #handler;
    #event;
    #context;
    #stream;

    /**
     * @param {Jymfony.Component.HttpServer.Serverless.AwsLambdaHandler} handler
     */
    constructor(handler) {
        super();
        this.#handler = handler;
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
        return this.#handler.handleEvent(this.#event, this.#stream, this.#context);
    }
}
