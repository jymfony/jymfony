const Command = Jymfony.Component.Console.Command.Command;

module.exports = class Foo4Command extends Command {
    configure() {
        this.name = 'foo3:bar:toh';
    }
};
