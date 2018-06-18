const Command = Jymfony.Component.Console.Command.Command;

class Foo2Command extends Command {
    /**
     * @inheritdoc
     */
    configure() {
        this.name = 'foo1:bar';
        this.description = 'The foo1:bar command';
        this.aliases = [ 'afoobar2' ];
    }

    /**
     * @inheritdoc
     */
    execute(input, output) {
        this.input = input;
        this.output = output;
    }
}

module.exports = Foo2Command;
