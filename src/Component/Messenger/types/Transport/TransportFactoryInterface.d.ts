declare namespace Jymfony.Component.Messenger.Transport {
    import SerializerInterface = Jymfony.Component.Messenger.Transport.Serialization.SerializerInterface;

    /**
     * Creates a Messenger transport.
     */
    export class TransportFactoryInterface {
        createTransport(dsn: string, options: any, serializer: SerializerInterface): Promise<TransportInterface>;

        supports(dsn: string, options: any): boolean;
    }
}
