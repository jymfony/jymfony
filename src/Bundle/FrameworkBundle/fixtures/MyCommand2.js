const Command = Jymfony.Component.Console.Command.Command;

class MyCommand2 extends Command {
    configure() {
        this.name = 'my:command:bar';
        this.description = 'The my:command:bar command';
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

module.exports = MyCommand2;
