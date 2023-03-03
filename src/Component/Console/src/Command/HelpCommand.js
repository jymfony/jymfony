const ApplicationDescription = Jymfony.Component.Console.Descriptor.ApplicationDescription;
const Command = Jymfony.Component.Console.Command.Command;
const InputArgument = Jymfony.Component.Console.Input.InputArgument;
const InputOption = Jymfony.Component.Console.Input.InputOption;
const DescriptorHelper = Jymfony.Component.Console.Helper.DescriptorHelper;

/**
 * @memberOf Jymfony.Component.Console.Command
 */
export default class HelpCommand extends Command {
    __construct(name = undefined) {
        super.__construct(name);
        this._command = undefined;
    }

    /**
     * @inheritdoc
     */
    configure() {
        this.ignoreValidationError();

        this.name = 'help';
        this.definition = [
            new InputArgument('command_name', InputArgument.OPTIONAL, 'The command name', 'help', () => Object.keys(new ApplicationDescription(this.application).commands)),
            new InputOption('format', undefined, InputOption.VALUE_REQUIRED, 'The output format (txt, xml, json, or md)', 'txt', () => new DescriptorHelper().formats),
            new InputOption('raw', undefined, InputOption.VALUE_NONE, 'To output raw command help'),
        ];
        this.description = 'Displays help for a command';
        this.help = `The <info>%command.name%</info> command displays help for a given command:

  <info>%command.full_name% list</info>

You can also output the help in other formats by using the <comment>--format</comment> option:

  <info>%command.full_name% --format=xml list</info>

To display the list of available commands, please use the <info>list</info> command.`
        ;
    }

    /**
     * Sets the command.
     *
     * @param {Jymfony.Component.Console.Command.Command} command The command to set
     */
    set command(command) {
        this._command = command;
    }

    /**
     * @inheritdoc
     */
    execute(input, output) {
        if (! this._command) {
            this._command = this.application.find(input.getArgument('command_name'));
        }

        const helper = new DescriptorHelper();
        helper.describe(output, this._command, {
            'format': input.getOption('format'),
            'raw_text': input.getOption('raw'),
        });

        this._command = undefined;
    }
}
