const AsCommand = Jymfony.Component.Console.Annotation.AsCommand;
const Command = Jymfony.Component.Console.Command.Command;
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

    /**
     * @inheritdoc
     */
    configure() {
        this.help = 'The <info>%command.name%</info> runs the dev server and spawns a subprocess with given arguments.';
        this.ignoreValidationError();
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

        await this._devServer.run(
            process.argv.filter(a => a !== input.firstArgument)
        );
    }
}
