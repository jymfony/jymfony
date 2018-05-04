const Command = Jymfony.Component.Console.Command.Command;

class BarBucCommand extends Command {
    /**
     * @inheritdoc
     */
    configure() {
        this.name = 'bar:buc';
    }
}

module.exports = BarBucCommand;
