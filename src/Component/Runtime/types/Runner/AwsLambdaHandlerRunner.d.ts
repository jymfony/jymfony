declare namespace Jymfony.Component.Runtime.Runner {
    import AwsLambdaRunnerInterface = Jymfony.Component.Runtime.Runner.AwsLambdaRunnerInterface;

    export class AwsLambdaHandlerRunner extends implementationOf(AwsLambdaRunnerInterface) {
        #handler;
        #event;
        #context;
        #stream;

        constructor(handler: any);

        setEvent(event: object): void;
        setContext(context: object): void;
        setStreamingResponse(stream: object): void;

        run(): any | Promise<any>;
    }
}
