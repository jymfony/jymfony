const Command = Jymfony.Component.Console.Command.Command;
const Dumper = Jymfony.Component.Console.Helper.Dumper;
const ErrorDetailsStamp = Jymfony.Component.Messenger.Stamp.ErrorDetailsStamp;
const ListableReceiverInterface = Jymfony.Component.Messenger.Transport.Receiver.ListableReceiverInterface;
const MessageCountAwareInterface = Jymfony.Component.Messenger.Transport.Receiver.MessageCountAwareInterface;
const RedeliveryStamp = Jymfony.Component.Messenger.Stamp.RedeliveryStamp;
const SentToFailureTransportStamp = Jymfony.Component.Messenger.Stamp.SentToFailureTransportStamp;
const TransportMessageIdStamp = Jymfony.Component.Messenger.Stamp.TransportMessageIdStamp;

/**
 * @memberOf Jymfony.Component.Messenger.Command
 *
 * @abstract
 * @internal
 */
export default class AbstractFailedMessagesCommand extends Command {
    static get defaultTransportOption() {
        return 'choose';
    }

    /**
     * Constructor.
     *
     * @param {string | null} globalFailureReceiverName
     * @param {Jymfony.Contracts.DependencyInjection.ServiceProviderInterface} failureTransports
     */
    __construct(globalFailureReceiverName, failureTransports) {
        /**
         * @type {Jymfony.Contracts.DependencyInjection.ServiceProviderInterface}
         *
         * @protected
         */
        this._failureTransports = failureTransports;

        /**
         * @type {string | null}
         *
         * @private
         */
        this._globalFailureReceiverName = globalFailureReceiverName;

        super.__construct();
    }

    /**
     * @returns {string | null}
     *
     * @protected
     */
    get globalFailureReceiverName() {
        return this._globalFailureReceiverName;
    }

    /**
     * @param {Jymfony.Component.Messenger.Envelope} envelope
     *
     * @returns {* | null}
     *
     * @protected
     */
    getMessageId(envelope) {
        /** @type {Jymfony.Component.Messenger.Stamp.TransportMessageIdStamp} stamp */
        const stamp = envelope.last(TransportMessageIdStamp);

        return null !== stamp ? stamp.id : null;
    }

    /**
     * @param {Jymfony.Component.Messenger.Envelope} envelope
     * @param {Jymfony.Component.Console.Style.JymfonyStyle} io
     *
     * @protected
     */
    displaySingleMessage(envelope, io) {
        io.title('Failed Message Details');

        /** @type {Jymfony.Component.Messenger.Stamp.SentToFailureTransportStamp | null} sentToFailureTransportStamp */
        const sentToFailureTransportStamp = envelope.last(SentToFailureTransportStamp);
        /** @type {Jymfony.Component.Messenger.Stamp.RedeliveryStamp | null} lastRedeliveryStamp */
        const lastRedeliveryStamp = envelope.last(RedeliveryStamp);
        /** @type {Jymfony.Component.Messenger.Stamp.ErrorDetailsStamp | null} lastErrorDetailsStamp */
        const lastErrorDetailsStamp = envelope.last(ErrorDetailsStamp);

        const rows = [
            [ 'Class', ReflectionClass.getClassName(envelope.message) ],
        ];

        const id = this.getMessageId(envelope);
        if (null !== id) {
            rows.push([ 'Message Id', id ]);
        }

        if (null === sentToFailureTransportStamp) {
            io.warning('Message does not appear to have been sent to this transport after failing');
        } else {
            let failedAt = '', errorMessage = '', errorCode = '', errorClass = '(unknown)';

            if (null !== lastRedeliveryStamp) {
                failedAt = lastRedeliveryStamp.redeliveredAt.format('Y-m-d H:i:s');
            }

            if (null !== lastErrorDetailsStamp) {
                errorMessage = lastErrorDetailsStamp.exceptionMessage;
                errorCode = lastErrorDetailsStamp.exceptionCode;
                errorClass = lastErrorDetailsStamp.exceptionClass;
            }

            rows.push([
                [ 'Failed at', failedAt ],
                [ 'Error', errorMessage ],
                [ 'Error Code', errorCode ],
                [ 'Error Class', errorClass ],
                [ 'Transport', sentToFailureTransportStamp.originalReceiverName ],
            ]);
        }

        io.table([], rows);

        /** @type {Jymfony.Component.Messenger.Stamp.RedeliveryStamp[]} redeliveryStamps */
        const redeliveryStamps = envelope.all(RedeliveryStamp);
        io.writeln(' Message history:');
        for (const redeliveryStamp of redeliveryStamps) {
            io.writeln(__jymfony.sprintf('  * Message failed at <info>%s</info> and was redelivered', redeliveryStamp.redeliveredAt.format('Y-m-d H:i:s')));
        }
        io.newLine();

        if (io.isVeryVerbose()) {
            io.title('Message:');
            const dump = new Dumper(io, null, this._createCloner());
            io.writeln(dump(envelope.message));
            io.title('Exception:');
            let flattenException = null;
            if (null !== lastErrorDetailsStamp) {
                flattenException = lastErrorDetailsStamp.flattenException;
            }
            io.writeln(null === flattenException ? '(no data)' : dump(flattenException));
        } else {
            io.writeln(' Re-run command with <info>-vv</info> to see more message & error details.');
        }
    }

    /**
     * @param {Jymfony.Component.Messenger.Transport.Receiver.ReceiverInterface} receiver
     * @param {Jymfony.Component.Console.Style.JymfonyStyle} io
     */
    printPendingMessagesMessage(receiver, io) {
        if (receiver instanceof MessageCountAwareInterface) {
            const { messageCount } = receiver;
            io.writeln(1 === messageCount
                ? 'There is <comment>1</comment> message pending in the failure transport.'
                : __jymfony.sprintf('There are <comment>%d</comment> messages pending in the failure transport.', messageCount)
            );
        }
    }

    /**
     * @param {string} name
     *
     * @returns {Jymfony.Component.Messenger.Transport.Receiver.ReceiverInterface}
     */
    getReceiver(name = null) {
        if (null === (name = name || this._globalFailureReceiverName)) {
            throw new InvalidArgumentException(__jymfony.sprintf('No default failure transport is defined. Available transports are: "%s".', Object.keys(this._failureTransports.getProvidedServices()).join('", "')));
        }

        if (!this._failureTransports.has(name)) {
            throw new InvalidArgumentException(__jymfony.sprintf('The "%s" failure transport was not found. Available transports are: "%s".', name, Object.keys(this._failureTransports.getProvidedServices()).join('", "')));
        }

        return this._failureTransports.get(name);
    }

    _createCloner() {
        if (!ReflectionClass.exists('Jymfony.Component.VarDumper.Cloner.VarCloner')) {
            return null;
        }

        const cloner = new Jymfony.Component.VarDumper.Cloner.VarCloner();
        cloner.addCasters({
            'Jymfony.Component.Debug.Exception.FlattenException': function (flattenException, a, stub) {
                const prefix = Jymfony.Component.VarDumper.Caster.Caster.PREFIX_VIRTUAL;
                stub.class_ = flattenException.class;

                return {
                    [prefix + 'message']: flattenException.message,
                    [prefix + 'code']: flattenException.code,
                    [prefix + 'file']: flattenException.file,
                    [prefix + 'line']: flattenException.line,
                    [prefix + 'trace']: new Jymfony.Component.VarDumper.Caster.TraceStub(flattenException.trace),
                };
            },
        });

        return cloner;
    }

    /**
     * @param {Jymfony.Component.Console.Style.JymfonyStyle} io
     * @param {string} failureTransportName
     */
    printWarningAvailableFailureTransports(io, failureTransportName) {
        const failureTransports = Object.keys(this._failureTransports.getProvidedServices());
        const failureTransportsCount = failureTransports.length;
        if (1 < failureTransportsCount) {
            io.writeln([
                __jymfony.sprintf('> Loading messages from the <comment>global</comment> failure transport <comment>%s</comment>.', failureTransportName),
                '> To use a different failure transport, pass <comment>--transport=</comment>.',
                __jymfony.sprintf('> Available failure transports are: <comment>%s</comment>', failureTransports.join(', ')),
                '\n',
            ]);
        }
    }

    /**
     * @param {Jymfony.Component.Console.Style.JymfonyStyle} io
     *
     * @returns {Promise<string>}
     */
    interactiveChooseFailureTransport(io) {
        const failedTransports = Object.keys(this._failureTransports.getProvidedServices());

        return io.choice('Select failed transport:', failedTransports, true);
    }

    async complete(input, suggestions) {
        if (input.mustSuggestOptionValuesFor('transport')) {
            suggestions.suggestValues(Object.keys(this._failureTransports.getProvidedServices()));

            return;
        }

        if (input.mustSuggestArgumentValuesFor('id')) {
            let transport = input.getOption('transport');
            transport = __self.defaultTransportOption === transport ? this.globalFailureReceiverName : transport;
            const receiver = this.getReceiver(transport);

            if (!(receiver instanceof ListableReceiverInterface)) {
                return;
            }

            const ids = [];
            for (const envelope of receiver.all(50)) {
                ids.push(this.getMessageId(envelope));
            }

            suggestions.suggestValues(ids);

            return;
        }
    }
}
