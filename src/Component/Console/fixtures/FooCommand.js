const Command = Jymfony.Component.Console.Command.Command;

class FooCommand extends Command {
    /**
     * @inheritdoc
     */
    configure() {
        this.name = 'foo:bar';
        this.description = 'The foo:bar command';
        this.aliases = [ 'afoobar' ];
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

module.exports = FooCommand;
