const Command = Jymfony.Component.Console.Command.Command;

class MyCommand extends Command {
    /**
     * @inheritdoc
     */
    configure() {
        this.name = 'my:command:foo';
        this.description = 'The my:command:foo command';
    }

    /**
     * @inheritdoc
     */
    interact(input, output) {
        output.writeln('interact called');
    }

    /**
     * @inheritdoc
     */
    execute(input, output) {
        this.input = input;
        this.output = output;

        output.writeln('called');
    }
}

module.exports = MyCommand;
