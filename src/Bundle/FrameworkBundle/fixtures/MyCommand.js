const Command = Jymfony.Component.Console.Command.Command;

class MyCommand extends Command {
    configure() {
        this.name = 'my:command:foo';
        this.description = 'The my:command:foo command';
    }

    interact(input, output) {
        output.writeln('interact called');
    }

    execute(input, output) {
        this.input = input;
        this.output = output;

        output.writeln('called');
    }
}

module.exports = MyCommand;
