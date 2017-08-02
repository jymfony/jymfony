const Command = Jymfony.Component.Console.Command.Command;

module.exports = class FoobarCommand extends Command {
    configure() {
        this.name = 'foobar:foo';
        this.description = 'The foobar:foo command';
    }

    execute(input, output) {
        this.input = input;
        this.output = output;
    }
};
