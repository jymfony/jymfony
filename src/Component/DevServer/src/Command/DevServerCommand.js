const AsCommand = Jymfony.Component.Console.Annotation.AsCommand;
const Command = Jymfony.Component.Console.Command.Command;
const CompletionInput = Jymfony.Component.Console.Completion.CompletionInput;
const InputArgument = Jymfony.Component.Console.Input.InputArgument;
const JymfonyStyle = Jymfony.Component.Console.Style.JymfonyStyle;

/**
 * @memberOf Jymfony.Component.DevServer.Command
 */
export default
@AsCommand({ name: 'dev-server:run', description: 'Runs the dev server' })
class DevServerCommand extends Command {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.DevServer.DevServer} devServer
     */
    __construct(devServer) {
        super.__construct();

        /**
         * @type {Jymfony.Component.DevServer.DevServer}
         *
         * @private
         */
        this._devServer = devServer;
    }

    complete(input, suggestions) {
        const tokens = input.tokens;
        let index = input.currentIndex;

        const cmdNameIdx = tokens.findIndex(v => v === this.name);
        if (-1 !== cmdNameIdx) {
            if (cmdNameIdx < index) {
                index--;
            }

            tokens.splice(cmdNameIdx, 1);
        }

        const optIdx = tokens.findIndex(v => '--' === v);
        if (-1 !== optIdx) {
            if (optIdx < index) {
                index--;
            }

            tokens.splice(optIdx, 1);
        }

        input = CompletionInput.fromTokens(tokens, index);
        try {
            input.bind(this.application.definition);
        } catch (e) {
            return;
        }

        this.application.complete(input, suggestions);
    }

    /**
     * @inheritdoc
     */
    configure() {
        this.help = 'The <info>%command.name%</info> runs the dev server and spawns a subprocess with given arguments.';
        this.addArgument('arg', InputArgument.REQUIRED | InputArgument.IS_ARRAY, 'The command and arguments to execute under dev server');
    }

    /**
     * @inheritdoc
     */
    async execute(input, output) {
        const io = new JymfonyStyle(input, output);
        io.title('Jymfony Dev Server');
        process.on('SIGINT', async () => {
            await this._devServer.close();
        });

        await this._devServer.run([ ...process.argv.slice(0, 2), ...input.getArgument('arg') ]);
    }
}
