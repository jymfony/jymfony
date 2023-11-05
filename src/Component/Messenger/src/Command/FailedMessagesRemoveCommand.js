const AbstractFailedMessagesCommand = Jymfony.Component.Messenger.Command.AbstractFailedMessagesCommand;
const AsCommand = Jymfony.Component.Console.Annotation.AsCommand;
const ConsoleOutputInterface = Jymfony.Component.Console.Output.ConsoleOutputInterface;
const InputArgument = Jymfony.Component.Console.Input.InputArgument;
const InputOption = Jymfony.Component.Console.Input.InputOption;
const JymfonyStyle = Jymfony.Component.Console.Style.JymfonyStyle;
const ListableReceiverInterface = Jymfony.Component.Messenger.Transport.Receiver.ListableReceiverInterface;

/**
 * @memberOf Jymfony.Component.Messenger.Command
 */
export default
@AsCommand({ name: 'messenger:failed:remove', description: 'Remove given messages from the failure transport' })
class FailedMessagesRemoveCommand extends AbstractFailedMessagesCommand {
    /**
     * {@inheritdoc}
     */
    configure() {
        this
            .addArgument('id', InputArgument.REQUIRED | InputArgument.IS_ARRAY, 'Specific message id(s) to remove')
            .addOption('force', null, InputOption.VALUE_NONE, 'Force the operation without confirmation')
            .addOption('transport', null, InputOption.VALUE_OPTIONAL, 'Use a specific failure transport', __self.defaultTransportOption);
        this.help = `
The <info>%command.name%</info> removes given messages that are pending in the failure transport.

    <info>%command.full_name% {id1} [{id2} ...]</info>

The specific ids can be found via the messenger:failed:show command.
`;
    }

    /**
     * {@inheritdoc}
     */
    async execute(input, output) {
        const io = new JymfonyStyle(input, output instanceof ConsoleOutputInterface ? output.errorOutput : output);

        let failureTransportName = input.getOption('transport');
        if (__self.defaultTransportOption === failureTransportName) {
            failureTransportName = this.globalFailureReceiverName;
        }

        const receiver = this.getReceiver(failureTransportName);

        const shouldForce = input.getOption('force');
        const ids = input.getArgument('id');
        const shouldDisplayMessages = input.getOption('show-messages') || 1 === ids.length;
        await this._removeMessages(failureTransportName, ids, receiver, io, shouldForce, shouldDisplayMessages);

        return __self.SUCCESS;
    }

    /**
     * @param {string} failureTransportName
     * @param {string[]} ids
     * @param {Jymfony.Component.Messenger.Transport.Receiver.ReceiverInterface} receiver
     * @param {Jymfony.Component.Console.Style.JymfonyStyle} io
     * @param {boolean} shouldForce
     * @param {boolean} shouldDisplayMessages
     *
     * @private
     */
    async _removeMessages(failureTransportName, ids, receiver, io, shouldForce, shouldDisplayMessages) {
        if (! (receiver instanceof ListableReceiverInterface)) {
            throw new RuntimeException(__jymfony.sprintf('The "%s" receiver does not support removing specific messages.', failureTransportName));
        }

        for (const id of ids) {
            const envelope = await receiver.find(id);
            if (null === envelope) {
                io.error(__jymfony.sprintf('The message with id "%s" was not found.', id));
                continue;
            }

            if (shouldDisplayMessages) {
                this.displaySingleMessage(envelope, io);
            }

            if (shouldForce || io.confirm('Do you want to permanently remove this message?', false)) {
                await receiver.reject(envelope);
                io.success(__jymfony.sprintf('Message with id %s removed.', id));
            } else {
                io.note(__jymfony.sprintf('Message with id %s not removed.', id));
            }
        }
    }
}
