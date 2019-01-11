const Command = Jymfony.Component.Console.Command.Command;

class Foo5Command extends Command {
    /**
     * @inheritdoc
     */
    __construct() {
        this._application = undefined;
    }
}

module.exports = Foo5Command;
