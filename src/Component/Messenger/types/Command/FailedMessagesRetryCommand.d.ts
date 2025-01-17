declare namespace Jymfony.Component.Messenger.Command {
    import EventDispatcherInterface = Jymfony.Contracts.EventDispatcher.EventDispatcherInterface;
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import JymfonyStyle = Jymfony.Component.Console.Style.JymfonyStyle;
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
    import MessageBusInterface = Jymfony.Component.Messenger.MessageBusInterface;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
    import ReceiverInterface = Jymfony.Component.Messenger.Transport.Receiver.ReceiverInterface;
    import ServiceProviderInterface = Jymfony.Contracts.DependencyInjection.ServiceProviderInterface;

    export class FailedMessagesRetryCommand extends AbstractFailedMessagesCommand {
        private _eventDispatcher: EventDispatcherInterface;
        private _messageBus: MessageBusInterface;
        private _logger: LoggerInterface;

        constructor(globalReceiverName: string | null, failureTransports: ServiceProviderInterface, messageBus: MessageBusInterface, eventDispatcher: EventDispatcherInterface, logger?: LoggerInterface);
        // @ts-ignore
        __construct(globalReceiverName: string | null, failureTransports: ServiceProviderInterface, messageBus: MessageBusInterface, eventDispatcher: EventDispatcherInterface, logger?: LoggerInterface): void;

        /**
         * {@inheritdoc}
         */
        configure(): void;

        /**
         * {@inheritdoc}
         */
        execute(input: InputInterface, output: OutputInterface): Promise<number>;

        runInteractive(failureTransportName: string, io: JymfonyStyle, shouldForce: boolean): Promise<void>;
        runWorker(failureTransportName: string, receiver: ReceiverInterface, io: JymfonyStyle, shouldForce: boolean): Promise<number>;
        retrySpecificIds(failureTransportName: string, ids: string[], io: JymfonyStyle, shouldForce: boolean): Promise<void>;
    }
}
