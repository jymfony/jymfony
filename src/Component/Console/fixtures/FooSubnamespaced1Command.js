const Command = Jymfony.Component.Console.Command.Command;

class FooSubnamespaced1Command extends Command {
    /**
     * @inheritdoc
     */
    configure() {
        this.name = 'foo:bar:baz';
        this.description = 'The foo:bar:baz command';
        this.aliases = [ 'foobarbaz' ];
    }

    /**
     * @inheritdoc
     */
    execute(input, output) {
        this.input = input;
        this.output = output;
    }
}

module.exports = FooSubnamespaced1Command;
