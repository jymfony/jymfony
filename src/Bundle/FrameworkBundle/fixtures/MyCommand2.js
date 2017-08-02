const Command = Jymfony.Component.Console.Command.Command;

class MyCommand2 extends Command {
    constructor() {
        super();
        super.__construct();
    }

    configure() {
        this.name = 'my:command:bar';
        this.description = 'The my:command:bar command';
    }

    interact(input, output) {
        output.writeln('interact called');
    }

    execute(input, output) {
        this.input = input;
        this.output = output;

        output.writeln('called');
    }
}

global.MyCommand2 = MyCommand2;
