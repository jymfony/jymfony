declare namespace Jymfony.Component.Console.Event {
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import Command = Jymfony.Component.Console.Command.Command;

    /**
     * Allows to manipulate the exit code of a command after its execution.
     */
    export class ConsoleTerminateEvent extends ConsoleEvent {
        /**
         * The exit code.
         */
        public exitCode: number;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(command: Command, input: InputInterface, output: OutputInterface, exitCode: number): void;
        constructor(command: Command, input: InputInterface, output: OutputInterface, exitCode: number);
    }
}
