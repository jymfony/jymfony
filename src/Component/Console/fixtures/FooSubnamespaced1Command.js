const Command = Jymfony.Component.Console.Command.Command;

module.exports = class FooSubnamespaced1Command extends Command {
    configure() {
        this.name = 'foo:bar:baz';
        this.description = 'The foo:bar:baz command';
        this.aliases = [ 'foobarbaz' ];
    }

    execute(input, output) {
        this.input = input;
        this.output = output;
    }
};
