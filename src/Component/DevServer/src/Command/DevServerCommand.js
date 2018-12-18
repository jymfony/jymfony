const Command = Jymfony.Component.Console.Command.Command;
const JymfonyStyle = Jymfony.Component.Console.Style.JymfonyStyle;

/**
 * @memberOf Jymfony.Component.DevServer.Command
 */
class DevServerCommand extends Command {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.DevServer.DevServer} devServer
     * @param {string} name
     */
    __construct(devServer, name = undefined) {
        super.__construct(name || 'dev-server:run');

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
        this.description = 'Runs the dev server';
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

module.exports = DevServerCommand;
