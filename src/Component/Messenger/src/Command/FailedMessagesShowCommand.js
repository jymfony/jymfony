const AbstractFailedMessagesCommand = Jymfony.Component.Messenger.Command.AbstractFailedMessagesCommand;
const AsCommand = Jymfony.Component.Console.Annotation.AsCommand;
const ConsoleOutputInterface = Jymfony.Component.Console.Output.ConsoleOutputInterface;
const ErrorDetailsStamp = Jymfony.Component.Messenger.Stamp.ErrorDetailsStamp;
const InputArgument = Jymfony.Component.Console.Input.InputArgument;
const InputOption = Jymfony.Component.Console.Input.InputOption;
const JymfonyStyle = Jymfony.Component.Console.Style.JymfonyStyle;
const ListableReceiverInterface = Jymfony.Component.Messenger.Transport.Receiver.ListableReceiverInterface;
const RedeliveryStamp = Jymfony.Component.Messenger.Stamp.RedeliveryStamp;

/**
 @memberOf Jymfony.Component.Messenger.Command
 */
export default
@AsCommand({ name: 'messenger:failed:show', description: 'Show one or more messages from the failure transport' })
class FailedMessagesShowCommand extends AbstractFailedMessagesCommand {
    /**
     * {@inheritdoc}
     */
    configure() {
        this
            .addArgument('id', InputArgument.OPTIONAL, 'Specific message id to show')
            .addOption('max', null, InputOption.VALUE_REQUIRED, 'Maximum number of messages to list', 50)
            .addOption('transport', null, InputOption.VALUE_OPTIONAL, 'Use a specific failure transport', __self.defaultTransportOption);

        this.help = `
The <info>%command.name%</info> shows message that are pending in the failure transport.

    <info>%command.full_name%</info>

Or look at a specific message by its id:

    <info>%command.full_name% {id}</info>
`;
    }

    /**
     * {@inheritdoc}
     */
    async execute(input, output) {
        const io = new JymfonyStyle(input, output instanceof ConsoleOutputInterface ? output.errorOutput : output);

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

        if (!(receiver instanceof ListableReceiverInterface)) {
            throw new RuntimeException(__jymfony.sprintf('The "%s" receiver does not support listing or showing specific messages.', failureTransportName));
        }

        const id = input.getArgument('id');
        if (null === id) {
            await this._listMessages(failureTransportName, io, input.getOption('max'));
        } else {
            await this._showMessage(failureTransportName, id, io);
        }

        return __self.SUCCESS;
    }

    /**
     * @param {string | null} failedTransportName
     * @param {Jymfony.Component.Console.Style.JymfonyStyle} io
     * @param {int | null} max
     *
     * @private
     */
    async _listMessages(failedTransportName, io, max) {
        /** @var ListableReceiverInterface $receiver */
        const receiver = this.getReceiver(failedTransportName);
        const envelopes = await receiver.all(max);

        const rows = [];
        for (const envelope of envelopes) {
            const lastRedeliveryStamp = envelope.last(RedeliveryStamp);
            const lastErrorDetailsStamp = envelope.last(ErrorDetailsStamp);

            let errorMessage = '';
            if (null !== lastErrorDetailsStamp) {
                errorMessage = lastErrorDetailsStamp.exceptionMessage;
            }

            rows.push = [
                this.getMessageId(envelope),
                ReflectionClass.getClassName(envelope.message),
                null === lastRedeliveryStamp ? '' : lastRedeliveryStamp.redeliveredAt.format('Y-m-d H:i:s'),
                errorMessage,
            ];
        }

        if (0 === rows.length) {
            io.success('No failed messages were found.');

            return;
        }

        io.table([ 'Id', 'Class', 'Failed at', 'Error' ], rows);

        if (rows.length === max) {
            io.comment(__jymfony.sprintf('Showing first %d messages.', max));
        }

        io.comment(__jymfony.sprintf('Run <comment>messenger:failed:show {id} --transport=%s -vv</comment> to see message details.', failedTransportName));
    }

    /**
     * @param {string | null} failedTransportName
     * @param {string} id
     * @param {Jymfony.Component.Console.Style.JymfonyStyle} io
     *
     * @return {Promise<void>}
     *
     * @private
     */
    async _showMessage(failedTransportName, id, io) {
        const receiver = this.getReceiver(failedTransportName);
        const envelope = await receiver.find(id);
        if (null === envelope) {
            throw new RuntimeException(__jymfony.sprintf('The message "%s" was not found.', id));
        }

        this.displaySingleMessage(envelope, io);

        io.writeln([
            '',
            __jymfony.sprintf(' Run <comment>messenger:failed:retry %s --transport=%s</comment> to retry this message.', id, failedTransportName),
            __jymfony.sprintf(' Run <comment>messenger:failed:remove %s --transport=%s</comment> to delete it.', id, failedTransportName),
        ]);
    }
}
