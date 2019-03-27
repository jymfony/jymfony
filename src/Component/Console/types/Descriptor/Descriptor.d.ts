declare namespace Jymfony.Component.Console.Descriptor {
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
    import InputArgument = Jymfony.Component.Console.Input.InputArgument;
    import InputOption = Jymfony.Component.Console.Input.InputOption;
    import InputDefinition = Jymfony.Component.Console.Input.InputDefinition;
    import Command = Jymfony.Component.Console.Command.Command;

    export abstract class Descriptor extends implementationOf(DescriptorInterface) {
        private _output?: OutputInterface;

        __construct(): void;
        constructor();

        /**
         * @inheritdoc
         */
        describe(output: OutputInterface, object: any, options?: any): void;

        /**
         * Writes content to output.
         */
        protected _write(content: string, decorated?: boolean): void;

        /**
         * Describes an InputArgument instance.
         */
        protected abstract describeInputArgument(argument: InputArgument, options?: any): void;

        /**
         * Describes an InputOption instance.
         */
        protected abstract describeInputOption(option: InputOption, options?: any): void;

        /**
         * Describes an InputDefinition instance.
         */
        protected abstract describeInputDefinition(definition: InputDefinition, options?: any): void;

        /**
         * Describes a Command instance.
         */
        protected abstract describeCommand(command: Command, options?: any): void;

        /**
         * Describes an Application instance.
         */
        protected abstract describeApplication(application: Application, options?: any): void;
    }
}
