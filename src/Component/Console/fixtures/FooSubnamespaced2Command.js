const Command = Jymfony.Component.Console.Command.Command;

module.exports = class FooSubnamespaced2Command extends Command {
    configure() {
        this.name = 'foo:go:bret';
        this.description = 'The foo:go:bret command';
        this.aliases = [ 'foogobret' ];
    }

    * execute(input, output) {
        this.input = input;
        this.output = output;
    }
};
