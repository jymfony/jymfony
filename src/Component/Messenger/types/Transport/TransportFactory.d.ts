declare namespace Jymfony.Component.Messenger.Transport {
    import SerializerInterface = Jymfony.Component.Messenger.Transport.Serialization.SerializerInterface;

    export class TransportFactory extends implementationOf(TransportFactoryInterface) {
        private _factories: TransportFactoryInterface[];

        /**
         * Constructor
         */
        __construct(factories: TransportFactoryInterface[]): void;
        constructor(factories: TransportFactoryInterface[]);

        createTransport(dsn: string, options: any, serializer: SerializerInterface): Promise<TransportInterface>;

        supports(dsn: string, options: any): boolean;
    }
}
