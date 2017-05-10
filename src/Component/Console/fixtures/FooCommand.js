const Command = Jymfony.Component.Console.Command.Command;

module.exports = class FooCommand extends Command {
    configure() {
        this.name = 'foo:bar';
        this.description = 'The foo:bar command';
        this.aliases = [ 'afoobar' ];
    }

    * interact(input, output) {
        output.writeln('interact called');
    }

    * execute(input, output) {
        this.input = input;
        this.output = output;

        output.writeln('called');
    }
};
