declare namespace Jymfony.Component.Runtime.Runner {
    import RunnerInterface = Jymfony.Component.Runtime.RunnerInterface;

    export class ClosureRunner extends implementationOf(RunnerInterface) {
        #closure;

        constructor(closure: Function);

        run(): Promise<any>;
    }
}
