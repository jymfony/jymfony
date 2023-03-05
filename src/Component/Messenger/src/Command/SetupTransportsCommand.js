const AsCommand = Jymfony.Component.Console.Annotation.AsCommand;
const Command = Jymfony.Component.Console.Command.Command;
const InputArgument = Jymfony.Component.Console.Input.InputArgument;
const JymfonyStyle = Jymfony.Component.Console.Style.JymfonyStyle;
const SetupableTransportInterface = Jymfony.Component.Messenger.Transport.SetupableTransportInterface;

/**
 * @memberOf Jymfony.Component.Messenger.Command
 */
export default
@AsCommand({ name: 'messenger:setup-transports', description: 'Prepare the required infrastructure for the transport' })
class SetupTransportsCommand extends Command {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerInterface} transportLocator
     * @param {string[]} [transportNames = []]
     */
    __construct(transportLocator, transportNames = []) {
        /**
         * @type {Jymfony.Component.DependencyInjection.ContainerInterface}
         *
         * @private
         */
        this._transportLocator = transportLocator;

        /**
         * @type {string[]}
         *
         * @private
         */
        this._transportNames = transportNames;

        super.__construct();
    }


    configure() {
        this.help = `The <info>%command.name%</info> command setups the transports:

    <info>%command.full_name%</info>

Or a specific transport only:

    <info>%command.full_name% <transport></info>
`;

        this.addArgument('transport', InputArgument.OPTIONAL, 'Name of the transport to setup', null, this._transportNames);
    }

    async execute(input, output) {
        const io = new JymfonyStyle(input, output);

        let transportNames = this._transportNames;
        let transport = input.getArgument('transport');
        // Do we want to set up only one transport?
        if (transport) {
            if (! this._transportLocator.has(transport)) {
                throw new RuntimeException(__jymfony.sprintf('The "%s" transport does not exist.', transport));
            }

            transportNames = [ transport ];
        }

        for (const transportName of transportNames) {
            transport = this._transportLocator.get(transportName);
            if (transport instanceof SetupableTransportInterface) {
                await transport.setup();
                io.success(__jymfony.sprintf('The "%s" transport was set up successfully.', transportName));
            } else {
                io.note(__jymfony.sprintf('The "%s" transport does not support setup.', transportName));
            }
        }

        return __self.SUCCESS;
    }
}
