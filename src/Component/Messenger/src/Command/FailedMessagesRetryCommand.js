const AbstractFailedMessagesCommand = Jymfony.Component.Messenger.Command.AbstractFailedMessagesCommand;
const AsCommand = Jymfony.Component.Console.Annotation.AsCommand;
const ConsoleOutputInterface = Jymfony.Component.Console.Output.ConsoleOutputInterface;
const InputArgument = Jymfony.Component.Console.Input.InputArgument;
const InputOption = Jymfony.Component.Console.Input.InputOption;
const JymfonyStyle = Jymfony.Component.Console.Style.JymfonyStyle;
const ListableReceiverInterface = Jymfony.Component.Messenger.Transport.Receiver.ListableReceiverInterface;
const SingleMessageReceiver = Jymfony.Component.Messenger.Transport.Receiver.SingleMessageReceiver;
const StopWorkerOnMessageLimitListener = Jymfony.Component.Messenger.EventListener.StopWorkerOnMessageLimitListener;
const Worker = Jymfony.Component.Messenger.Worker;
const WorkerMessageReceivedEvent = Jymfony.Component.Messenger.Event.WorkerMessageReceivedEvent;

/**
 @memberOf Jymfony.Component.Messenger.Command
 */
export default
@AsCommand({ name: 'messenger:failed:retry', description: 'Retry one or more messages from the failure transport' })
class FailedMessagesRetryCommand extends AbstractFailedMessagesCommand {
    /**
     * @type {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface}
     *
     * @private
     */
    _eventDispatcher;

    /**
     * @type {Jymfony.Component.Messenger.MessageBusInterface}
     *
     * @private
     */
    _messageBus;

    /**
     * @type {Jymfony.Contracts.Logger.LoggerInterface}
     *
     * @private
     */
    _logger;

    /**
     * Constructor.
     *
     * @param {string | null} globalReceiverName
     * @param {Jymfony.Contracts.DependencyInjection.ServiceProviderInterface} failureTransports
     * @param {Jymfony.Component.Messenger.MessageBusInterface} messageBus
     * @param {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface} eventDispatcher
     * @param {Jymfony.Contracts.Logger.LoggerInterface} logger
     */
    __construct(globalReceiverName, failureTransports, messageBus, eventDispatcher, logger = null) {
        this._eventDispatcher = eventDispatcher;
        this._messageBus = messageBus;
        this._logger = logger;

        super.__construct(globalReceiverName, failureTransports);
    }

    /**
     * {@inheritdoc}
     */
    configure() {
        this
            .addArgument('id', InputArgument.IS_ARRAY, 'Specific message id(s) to retry')
            .addOption('force', null, InputOption.VALUE_NONE, 'Force action without confirmation')
            .addOption('transport', null, InputOption.VALUE_OPTIONAL, 'Use a specific failure transport', __self.defaultTransportOption);

        this.help = `
The <info>%command.name%</info> retries message in the failure transport.

    <info>%command.full_name%</info>

The command will interactively ask if each message should be retried
or discarded.

Some transports support retrying a specific message id, which comes
from the <info>messenger:failed:show</info> command.

    <info>%command.full_name% {id}</info>

Or pass multiple ids at once to process multiple messages:

<info>%command.full_name% {id1} {id2} {id3}</info>

`;
    }

    /**
     * {@inheritdoc}
     */
    async execute(input, output) {
        this._eventDispatcher.addSubscriber(new StopWorkerOnMessageLimitListener(1));

        const io = new JymfonyStyle(input, output instanceof ConsoleOutputInterface ? output.errorOutput : output);
        io.comment('Quit this command with CONTROL-C.');
        if (! output.isVeryVerbose()) {
            io.comment('Re-run the command with a -vv option to see logs about consumed messages.');
        }

        let failureTransportName = input.getOption('transport');
        if (__self.defaultTransportOption === failureTransportName) {
            this.printWarningAvailableFailureTransports(io, this.globalFailureReceiverName);
        }

        if ('' === failureTransportName || null === failureTransportName) {
            failureTransportName = await this.interactiveChooseFailureTransport(io);
        }

        failureTransportName = __self.defaultTransportOption === failureTransportName ? this.globalFailureReceiverName : failureTransportName;

        const receiver = this.getReceiver(failureTransportName);
        this.printPendingMessagesMessage(receiver, io);

        io.writeln(__jymfony.sprintf('To retry all the messages, run <comment>messenger:consume %s</comment>', failureTransportName));

        const shouldForce = input.getOption('force');
        const ids = input.getArgument('id');
        if (0 === ids.length) {
            if (! input.interactive) {
                throw new RuntimeException('Message id must be passed when in non-interactive mode.');
            }

            await this.runInteractive(failureTransportName, io, shouldForce);

            return 0;
        }

        await this.retrySpecificIds(failureTransportName, ids, io, shouldForce);
        io.success('All done!');

        return 0;
    }

    /**
     * @param {string} failureTransportName
     * @param {Jymfony.Component.Console.Style.JymfonyStyle} io
     * @param {boolean} shouldForce
     *
     * @return {Promise<void>}
     */
    async runInteractive(failureTransportName, io, shouldForce) {
        const receiver = this.getReceiver(failureTransportName);
        let count = 0;
        if (receiver instanceof ListableReceiverInterface) {
            /*
             * For listable receivers, find the messages one-by-one
             * this avoids using get(), which for some less-robust
             * transports, will cause the message to be temporarily
             * "acked", even if the user aborts handling the message.
             */
            while (true) {
                const ids = [];
                for (const envelope of await receiver.all(1)) {
                    ++count;

                    const id = this.getMessageId(envelope);
                    if (null === id) {
                        throw new LogicException(__jymfony.sprintf('The "%s" receiver is able to list messages by id but the envelope is missing the TransportMessageIdStamp stamp.', failureTransportName));
                    }

                    ids.push(id);
                }

                // Break the loop if all messages are consumed
                if (0 === ids.length) {
                    break;
                }

                await this.retrySpecificIds(failureTransportName, ids, io, shouldForce);
            }
        } else {
            // Get() and ask messages one-by-one
            count = await this.runWorker(failureTransportName, receiver, io, shouldForce);
        }

        // Avoid success message if nothing was processed
        if (1 <= count) {
            io.success('All failed messages have been handled or removed!');
        }
    }

    /**
     * @param {string} failureTransportName
     * @param {Jymfony.Component.Messenger.Transport.ReceiverInterface} receiver
     * @param {Jymfony.Component.Console.Style.JymfonyStyle} io
     * @param {boolean} shouldForce
     *
     * @return {Promise<*>}
     */
    async runWorker(failureTransportName, receiver, io, shouldForce){
        let count = 0;
        const listener = async messageReceivedEvent => {
            ++count;
            const envelope = messageReceivedEvent.envelope;

            this.displaySingleMessage(envelope, io);

            const shouldHandle = shouldForce || await io.confirm('Do you want to retry (yes) or delete this message (no)?');
            if (shouldHandle) {
                return;
            }

            messageReceivedEvent.shouldHandle(false);
            await receiver.reject(envelope);
        };

        this._eventDispatcher.addListener(WorkerMessageReceivedEvent, listener);

        const worker = new Worker(
            { [failureTransportName]: receiver },
            this._messageBus,
            this._eventDispatcher,
            this._logger,
        );

        try {
            await worker.run();
        } finally {
            this._eventDispatcher.removeListener(WorkerMessageReceivedEvent, listener);
        }

        return count;
    }

    /**
     * @param {string} failureTransportName
     * @param {string[]} ids
     * @param {Jymfony.Component.Console.Style.JymfonyStyle} io
     * @param {boolean} shouldForce
     *
     * @return {Promise<void>}
     */
    async retrySpecificIds(failureTransportName, ids, io, shouldForce) {
        const receiver = this.getReceiver(failureTransportName);
        if (! (receiver instanceof ListableReceiverInterface)) {
            throw new RuntimeException(__jymfony.sprintf('The "%s" receiver does not support retrying messages by id.', failureTransportName));
        }

        for (const id of ids) {
            const envelope = await receiver.find(id);
            if (null === envelope) {
                throw new RuntimeException(__jymfony.sprintf('The message "%s" was not found.', id));
            }

            const singleReceiver = new SingleMessageReceiver(receiver, envelope);
            await this.runWorker(failureTransportName, singleReceiver, io, shouldForce);
        }
    }
}
