declare namespace Jymfony.Component.Console.Descriptor {
    import InputArgument = Jymfony.Component.Console.Input.InputArgument;
    import InputOption = Jymfony.Component.Console.Input.InputOption;
    import InputDefinition = Jymfony.Component.Console.Input.InputDefinition;
    import Command = Jymfony.Component.Console.Command.Command;

    class JsonDescriptor extends Descriptor {
        /**
         * @inheritdoc
         */
        describeInputArgument(argument: InputArgument, options?: any): void;

        /**
         * @inheritdoc
         */
        describeInputOption(option: InputOption, options?: any): void;

        /**
         * @inheritdoc
         */
        describeInputDefinition(definition: InputDefinition, options?: any): void;

        /**
         * @inheritdoc
         */
        describeCommand(command: Command, options?: any): void;

        /**
         * @inheritdoc
         */
        describeApplication(application: Application, options?: any): void;

        /**
         * Writes data as json.
         */
        _writeData(data: any, options?: any): void;

        private _getInputArgumentData(argument: InputArgument): Record<string, string|boolean|number>;

        private _getInputOptionData(option: InputOption): Record<string, string|boolean|number>;

        private _getInputDefinitionData(definition: InputDefinition): any;

        private _getCommandData(command: Command): any;
    }
}
