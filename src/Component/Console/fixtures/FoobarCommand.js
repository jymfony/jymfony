const Command = Jymfony.Component.Console.Command.Command;

class FoobarCommand extends Command {
    /**
     * @inheritdoc
     */
    configure() {
        this.name = 'foobar:foo';
        this.description = 'The foobar:foo command';
    }

    /**
     * @inheritdoc
     */
    execute(input, output) {
        this.input = input;
        this.output = output;
    }
}

module.exports = FoobarCommand;
