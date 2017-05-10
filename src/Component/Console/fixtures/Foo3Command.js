const Command = Jymfony.Component.Console.Command.Command;

module.exports = class Foo3Command extends Command {
    configure() {
        this.name = 'foo3:bar';
        this.description = 'The foo3:bar command';
    }

    execute(input, output) {
        try {
            try {
                throw new Exception('First exception <p>this is html</p>');
            } catch (e) {
                throw new Exception('Second exception <comment>comment</comment>', 0, e);
            }
        } catch (e) {
            throw new Exception('Third exception <fg=blue;bg=red>comment</>', 404, e);
        }
    }
};
