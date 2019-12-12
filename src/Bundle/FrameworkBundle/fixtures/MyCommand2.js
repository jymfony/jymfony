const Command = Jymfony.Component.Console.Command.Command;

export default class MyCommand2 extends Command {
    /**
     * @inheritdoc
     */
    configure() {
        this.name = 'my:command:bar';
        this.description = 'The my:command:bar command';
    }

    /**
     * @inheritdoc
     */
    interact(input, output) {
        output.writeln('interact called');
    }

    /**
     * @inheritdoc
     */
    execute(input, output) {
        this.input = input;
        this.output = output;

        output.writeln('called');
    }
}
