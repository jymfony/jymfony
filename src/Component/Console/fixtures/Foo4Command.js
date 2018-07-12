const Command = Jymfony.Component.Console.Command.Command;

class Foo4Command extends Command {
    /**
     * @inheritdoc
     */
    configure() {
        this.name = 'foo3:bar:toh';
    }
}

module.exports = Foo4Command;
