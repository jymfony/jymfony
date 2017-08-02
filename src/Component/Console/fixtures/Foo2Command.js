const Command = Jymfony.Component.Console.Command.Command;

module.exports = class Foo2Command extends Command {
    configure() {
        this.name = 'foo1:bar';
        this.description = 'The foo1:bar command';
        this.aliases = [ 'afoobar2' ];
    }

    execute(input, output) {
        this.input = input;
        this.output = output;
    }
};
