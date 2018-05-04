const Command = Jymfony.Component.Console.Command.Command;
const InputArgument = Jymfony.Component.Console.Input.InputArgument;
const InputDefinition = Jymfony.Component.Console.Input.InputDefinition;
const InputOption = Jymfony.Component.Console.Input.InputOption;
const DescriptorHelper = Jymfony.Component.Console.Helper.DescriptorHelper;

/**
 * @memberOf Jymfony.Component.Console.Command
 */
class ListCommand extends Command {
    /**
     * @inheritdoc
     */
    configure() {
        this.name = 'list';
        this.definition = this._createDefinition();
        this.description = 'Lists commands';
        this.help = `The <info>%command.name%</info> command lists all commands:

  <info>%command.full_name%</info>

You can also display the commands for a specific namespace:

  <info>%command.full_name% test</info>

You can also output the information in other formats by using the <comment>--format</comment> option:

  <info>%command.full_name% --format=xml</info>

It's also possible to get raw list of commands (useful for embedding command runner):

  <info>%command.full_name% --raw</info>`
        ;
    }

    /**
     * @inheritdoc
     */
    get nativeDefinition() {
        return this._createDefinition();
    }

    /**
     * @inheritdoc
     */
    execute(input, output) {
        const helper = new DescriptorHelper();
        helper.describe(output, this.application, {
            format: input.getOption('format'),
            raw_text: input.getOption('raw'),
            namespace: input.getArgument('namespace'),
        });
    }

    /**
     * @inheritdoc
     */
    _createDefinition() {
        return new InputDefinition([
            new InputArgument('namespace', InputArgument.OPTIONAL, 'The namespace name'),
            new InputOption('raw', undefined, InputOption.VALUE_NONE, 'To output raw command list'),
            new InputOption('format', undefined, InputOption.VALUE_REQUIRED, 'The output format (txt, xml, json, or md)', 'txt'),
        ]);
    }
}

module.exports = ListCommand;
