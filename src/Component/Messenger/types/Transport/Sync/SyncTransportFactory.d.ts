declare namespace Jymfony.Component.Messenger.Transport.Sync {
    import TransportFactoryInterface = Jymfony.Component.Messenger.Transport.TransportFactoryInterface;
    import MessageBusInterface = Jymfony.Component.Messenger.MessageBusInterface;

    export class SyncTransportFactory extends implementationOf(TransportFactoryInterface) {
        private _messageBus: MessageBusInterface;

        /**
         * Constructor.
         */
        __construct(messageBus: MessageBusInterface): void;
        constructor(messageBus: MessageBusInterface);

        createTransport(): Promise<SyncTransport>;

        supports(dsn: string): boolean;
    }
}
