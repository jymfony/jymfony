declare namespace Jymfony.Component.Console.Descriptor {
    import Command = Jymfony.Component.Console.Command.Command;
    import InputOption = Jymfony.Component.Console.Input.InputOption;
    import InputArgument = Jymfony.Component.Console.Input.InputArgument;
    import InputDefinition = Jymfony.Component.Console.Input.InputDefinition;

    export class TextDescriptor extends Descriptor {
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
         * @private
         */
        private _writeText(content: string, options?: any): void;

        /**
         * Formats command aliases to show them in the command description.
         */
        private _getCommandAliasesText(command: Command): string;

        /**
         * Formats input option/argument default value.
         */
        private _formatDefaultValue(defaultValue: any): string;

        private _getColumnWidth(commands: Command[]): number;

        private _calculateTotalWidthForOptions(options: InputOption[]): number;
    }
}
