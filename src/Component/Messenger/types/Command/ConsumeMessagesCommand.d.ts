declare namespace Jymfony.Component.Messenger.Command {
    import Command = Jymfony.Component.Console.Command.Command;
    import ContainerInterface = Jymfony.Component.DependencyInjection.ContainerInterface;
    import EventDispatcherInterface = Jymfony.Contracts.EventDispatcher.EventDispatcherInterface;
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
    import RoutableMessageBus = Jymfony.Component.Messenger.RoutableMessageBus;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

    export class ConsumeMessagesCommand extends Command {
        private _routableBus: RoutableMessageBus;
        private _receiverLocator: ContainerInterface;
        private _eventDispatcher: EventDispatcherInterface;
        private _logger: null | LoggerInterface;
        private _receiverNames: string[];
        private _busIds: string[];

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(routableBus: RoutableMessageBus, receiverLocator: ContainerInterface, eventDispatcher: EventDispatcherInterface, logger?: LoggerInterface, receiverNames?: string[], busIds?: string[]): void;
        constructor(routableBus: RoutableMessageBus, receiverLocator: ContainerInterface, eventDispatcher: EventDispatcherInterface, logger?: LoggerInterface, receiverNames?: string[], busIds?: string[]);

        /**
         * @inheritdoc
         */
        configure(): void;

        /**
         * @inheritdoc
         */
        interact(input: InputInterface, output: OutputInterface): Promise<void>;

        /**
         * @inheritdoc
         */
        execute(input: InputInterface, output: OutputInterface): Promise<number>;

        private _convertToBytes(memoryLimit: string): string;
    }
}
