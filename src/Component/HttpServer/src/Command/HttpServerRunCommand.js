const Command = Jymfony.Component.Console.Command.Command;
const JymfonyStyle = Jymfony.Component.Console.Style.JymfonyStyle;
const InputArgument = Jymfony.Component.Console.Input.InputArgument;

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
        super.__construct('http:listen');

        /**
         * @type {Jymfony.Component.HttpServer.HttpServer}
         * @private
         */
        this._server = server;
    }

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

    * execute(input, output) {
        const io = new JymfonyStyle(input, output);
        io.title('Http server');

        const p = this._server.listen({ port: input.getArgument('port'), host: input.getArgument('address') });
        io.success('Listening...');

        try {
            yield p;
        } catch (e) {
            io.error(e.message);
        }
    }
}

module.exports = HttpServerRunCommand;
