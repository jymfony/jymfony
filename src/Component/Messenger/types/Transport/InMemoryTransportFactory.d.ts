declare namespace Jymfony.Component.Messenger.Transport {
    import SerializerInterface = Jymfony.Component.Messenger.Transport.Serialization.SerializerInterface;

    export class InMemoryTransportFactory extends implementationOf(TransportFactoryInterface) {
        private _createdTransports: InMemoryTransport[];

        __construct(): void;
        constructor();

        createTransport(dsn: string, options: any, serializer: SerializerInterface): Promise<TransportInterface>;

        supports(dsn: string): boolean;

        private _parseDsn(dsn: string): { serialize: boolean };
    }
}
