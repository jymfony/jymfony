const Command = Jymfony.Component.Console.Command.Command;

class FooSubnamespaced2Command extends Command {
    /**
     * @inheritdoc
     */
    configure() {
        this.name = 'foo:go:bret';
        this.description = 'The foo:go:bret command';
        this.aliases = [ 'foogobret' ];
    }

    /**
     * @inheritdoc
     */
    execute(input, output) {
        this.input = input;
        this.output = output;
    }
}

module.exports = FooSubnamespaced2Command;
