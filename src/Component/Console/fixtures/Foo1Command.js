const Command = Jymfony.Component.Console.Command.Command;

class Foo1Command extends Command {
    /**
     * @inheritdoc
     */
    configure() {
        this.name = 'foo:bar1';
        this.description = 'The foo:bar1 command';
        this.aliases = [ 'afoobar1' ];
    }

    /**
     * @inheritdoc
     */
    execute(input, output) {
        this.input = input;
        this.output = output;
    }
}

module.exports = Foo1Command;
