const Command = Jymfony.Component.Console.Command.Command;

module.exports = class TestCommand extends Command {
    configure() {
        this.name = 'namespace:name';
        this.description = 'description';
        this.aliases = [ 'name' ];
        this.help = 'help';
    }

    execute(input, output) {
        output.writeln('execute called');
    }

    interact(input, output) {
        output.writeln('interact called');
    }
};
