const Command = Jymfony.Component.Console.Command.Command;

module.exports = class Foo1Command extends Command {
    configure() {
        this.name = 'foo:bar1';
        this.description = 'The foo:bar1 command';
        this.aliases = [ 'afoobar1' ];
    }

    * execute(input, output) {
        this.input = input;
        this.output = output;
    }
};
