const Command = Jymfony.Component.Console.Command.Command;
const JymfonyStyle = Jymfony.Component.Console.Style.JymfonyStyle;
const InputArgument = Jymfony.Component.Console.Input.InputArgument;

const url = require('url');

/**
 * @memberOf Jymfony.Component.HttpServer.Command
 */
class HttpServerRunCommand extends Command {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.HttpServer.HttpServer} server
     */
    __construct(server) {
        super.__construct();

        /**
         * @type {Jymfony.Component.HttpServer.HttpServer}
         *
         * @private
         */
        this._server = server;
    }

    /**
     * @inheritDoc
     */
    static get defaultName() {
        return 'http:listen';
    }

    /**
     * @inheritdoc
     */
    configure() {
        this.description = 'Run the http server and listen for incoming connections';
        this.help = `The <info>%command.name%</info> command will run the http server and listen for connections on the given address and port:

  <info>%command.full_name%</info>

Will listen on all addresses on port 80.
  
  <info>%command.full_name% 127.0.0.1 8080</info>

Starts the server and listen on port 8080 on localhost address only.`
        ;

        this.addArgument('address', InputArgument.OPTIONAL, 'The address where the server will listen to', '0.0.0.0');
        this.addArgument('port', InputArgument.OPTIONAL, 'The port', 80);
    }

    /**
     * @inheritdoc
     */
    async execute(input, output) {
        const io = new JymfonyStyle(input, output);
        io.title('Http server');

        let port = input.getArgument('port');
        const address = input.getArgument('address');
        const p = this._server.listen({ port, host: address });
        io.success([
            'Listening...',
            'Press Ctrl-C to exit',
        ]);

        if (('http' === this._server.scheme && 80 === port) || ('https' === this._server.scheme && 443 === port)) {
            port = undefined;
        }

        const serverAddress = url.format({
            protocol: this._server.scheme + ':',
            hostname: -1 !== [ '0.0.0.0', '::' ].indexOf(address) ? 'localhost' : address,
            port,
            pathname: '/',
        });

        io.comment('<href=' + serverAddress + '>Open ' + serverAddress + '</>');
        process.on('SIGINT', async () => {
            await this._server.close();
        });

        try {
            await p;
        } catch (e) {
            io.error(e.message);
        }
    }
}

module.exports = HttpServerRunCommand;
