const Command = Jymfony.Component.Console.Command.Command;

module.exports = class BarBucCommand extends Command {
    configure() {
        this.name = 'bar:buc';
    }
};
