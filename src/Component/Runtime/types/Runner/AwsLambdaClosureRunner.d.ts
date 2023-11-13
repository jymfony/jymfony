declare namespace Jymfony.Component.Runtime.Runner {
    export class AwsLambdaClosureRunner extends implementationOf(AwsLambdaRunnerInterface) {
        #closure;
        #event;
        #context;
        #stream;

        constructor(closure: Function);

        setEvent(event: object): void;
        setContext(context: object): void;
        setStreamingResponse(stream: object): void;

        run(): any | Promise<any>;
    }
}
