declare namespace Jymfony.Component.Messenger.Command {
    import Command = Jymfony.Component.Console.Command.Command;
    import CompletionInput = Jymfony.Component.Console.Completion.CompletionInput;
    import CompletionSuggestions = Jymfony.Component.Console.Completion.CompletionSuggestions;
    import ServiceProviderInterface = Jymfony.Contracts.DependencyInjection.ServiceProviderInterface;
    import Envelope = Jymfony.Component.Messenger.Envelope;
    import JymfonyStyle = Jymfony.Component.Console.Style.JymfonyStyle;
    import ReceiverInterface = Jymfony.Component.Messenger.Transport.Receiver.ReceiverInterface;

    /**
     * @abstract
     * @internal
     */
    export class AbstractFailedMessagesCommand extends Command {
        static readonly defaultTransportOption: string;
        private _failureTransports: ServiceProviderInterface;
        private _globalFailureReceiverName: string;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(globalFailureReceiverName: string | null, failureTransports: ServiceProviderInterface): void;
        constructor(globalFailureReceiverName: string | null, failureTransports: ServiceProviderInterface);

        protected readonly globalFailureReceiverName: string | null;

        protected getMessageId(envelope: Envelope): any | null;

        protected displaySingleMessage(envelope: Envelope, io: JymfonyStyle): void;

        protected printPendingMessagesMessage(receiver: ReceiverInterface, io: JymfonyStyle): void;

        getReceiver(name?: string): ReceiverInterface;

        private _createCloner(): unknown;

        protected printWarningAvailableFailureTransports(io: JymfonyStyle, failureTransportName: string): void;

        protected interactiveChooseFailureTransport(io: JymfonyStyle): Promise<string>;

        complete(input: CompletionInput, suggestions: CompletionSuggestions): Promise<void>;
    }
}
