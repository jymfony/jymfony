declare namespace Jymfony.Component.Console.Command {
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
    import InputDefinition = Jymfony.Component.Console.Input.InputDefinition;

    export class ListCommand extends Command {
        /**
         * @inheritdoc
         */
        public readonly nativeDefinition: InputDefinition;

        /**
         * @inheritdoc
         */
        configure(): void;

        /**
         * @inheritdoc
         */
        execute(input: InputInterface, output: OutputInterface): void;

        /**
         * @inheritdoc
         */
        _createDefinition(): InputDefinition;
    }
}
