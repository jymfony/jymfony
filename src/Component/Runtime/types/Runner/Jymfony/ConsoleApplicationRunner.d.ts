declare namespace Jymfony.Component.Runtime.Runner.Jymfony {
    import Application = Jymfony.Component.Console.Application;
    import InputInterface = Jymfony.Contracts.Console.InputInterface;
    import OutputInterface = Jymfony.Contracts.Console.OutputInterface;
    import RunnerInterface = Jymfony.Component.Runtime.RunnerInterface;

    export class ConsoleApplicationRunner extends implementationOf(RunnerInterface) {
        #application;
        #defaultEnv;
        #input;
        #output;

        constructor(application: Application, defaultEnv: string | null, input: InputInterface, output?: OutputInterface);

        run(): any | Promise<any>;
    }
}
