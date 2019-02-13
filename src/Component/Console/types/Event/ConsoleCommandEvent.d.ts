declare namespace Jymfony.Component.Console.Event {
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import Command = Jymfony.Component.Console.Command.Command;

    /**
     * Allows to do things before the command is executed, like skipping the command or changing the input.
     */
    export class ConsoleCommandEvent extends ConsoleEvent {
        /**
         * The return code for skipped commands, this will also be passed into the terminate event.
         */
        public static readonly RETURN_CODE_DISABLED = 113;

        /**
         * Returns true if the command is runnable, false otherwise.
         */
        public readonly commandShouldRun: boolean;

        /**
         * Indicates if the command should be run or skipped.
         */
        private _commandShouldRun: boolean;

        /**
         * @inheritdoc
         */
        __construct(command: Command | undefined, input: InputInterface, output: OutputInterface): void;
        constructor(command: Command | undefined, input: InputInterface, output: OutputInterface);

        /**
         * Disables the command.
         */
        disableCommand(): void;

        /**
         * Enables the command.
         */
        enableCommand(): void;
    }
}
