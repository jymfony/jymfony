const Command = Jymfony.Component.Console.Command.Command;

class Foo3Command extends Command {
    /**
     * @inheritdoc
     */
    configure() {
        this.name = 'foo3:bar';
        this.description = 'The foo3:bar command';
    }

    /**
     * @inheritdoc
     */
    execute() {
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
}

module.exports = Foo3Command;
