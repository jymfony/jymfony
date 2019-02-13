declare namespace Jymfony.Component.Console.Command {
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

    export class HelpCommand extends Command {
        /**
         * Sets the help command.
         */
        public /* writeonly */ command: Command;

        __construct(name?: string): void;
        constructor(name?: string);

        /**
         * @inheritdoc
         */
        configure(): void;

        /**
         * @inheritdoc
         */
        execute(input: InputInterface, output: OutputInterface): void;
    }
}
