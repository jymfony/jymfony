declare namespace Jymfony.Contracts.Console.Event {
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
        __construct(command: CommandInterface, input: InputInterface, output: OutputInterface, exitCode: number): void;
        constructor(command: CommandInterface, input: InputInterface, output: OutputInterface, exitCode: number);
    }
}
