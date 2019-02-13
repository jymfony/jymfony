declare namespace Jymfony.Component.Console.Event {
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import Command = Jymfony.Component.Console.Command.Command;

    /**
     * Allows to handle throwables thrown while running a command.
     */
    export class ConsoleErrorEvent extends ConsoleEvent {
        /**
         * The thrown error/exception.
         * Allow thw thrown error to be replaced.
         */
        public error: Error;

        /**
         * The exit code.
         */
        public exitCode: number;

        /**
         * The thrown error.
         */
        private _error: Error;

        /**
         * The process exit code.
         */
        private _exitCode: number | undefined;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(input: InputInterface, output: OutputInterface, error: Error, command: Command | undefined): void;
        constructor(input: InputInterface, output: OutputInterface, error: Error, command: Command | undefined);
    }
}
