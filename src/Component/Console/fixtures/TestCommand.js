const Command = Jymfony.Component.Console.Command.Command;

class TestCommand extends Command {
    /**
     * @inheritdoc
     */
    configure() {
        this.name = 'namespace:name';
        this.description = 'description';
        this.aliases = [ 'name' ];
        this.help = 'help';
    }

    /**
     * @inheritdoc
     */
    execute(input, output) {
        output.writeln('execute called');
    }

    /**
     * @inheritdoc
     */
    interact(input, output) {
        output.writeln('interact called');
    }
}

module.exports = TestCommand;
