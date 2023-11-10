const AwsLambdaRunnerInterface = Jymfony.Component.Runtime.Runner.Jymfony.AwsLambdaRunnerInterface;

/**
 * @memberof Jymfony.Component.Runtime.Runner.Jymfony
 */
export default class AwsLambdaHandlerRunner extends implementationOf(AwsLambdaRunnerInterface) {
    /**
     * @type {Jymfony.Component.HttpServer.Serverless.AwsLambdaHandler}
     */
    #handler;
    #event;
    #context;

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

    run() {
        return this.#handler.handle(this.#event, this.#context);
    }
}
