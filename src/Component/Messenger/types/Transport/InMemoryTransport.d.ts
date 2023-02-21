declare namespace Jymfony.Component.Messenger.Transport {
    import Envelope = Jymfony.Component.Messenger.Envelope;
    import SerializerInterface = Jymfony.Component.Messenger.Transport.Serialization.SerializerInterface;

    /**
     * Transport that stays in memory. Useful for testing purpose.
     */
    export class InMemoryTransport extends implementationOf(TransportInterface) {
        private _sent: Envelope[];
        private _acknowledged: Envelope[];
        private _rejected: Envelope[];
        private _queue: Map<any, Envelope>;
        private _nextId: number;
        private _serializer: SerializerInterface | null;

        /**
         * Constructor.
         */
        __construct(serializer?: SerializerInterface): void;
        constructor(serializer?: SerializerInterface);

        /**
         * @inheritdoc
         */
        get(): Promise<Envelope[]>;

        /**
         * @inheritdoc
         */
        ack(envelope: Envelope): Promise<void>;

        /**
         * @inheritdoc
         */
        reject(envelope: Envelope): Promise<void>;

        /**
         * @inheritdoc
         */
        send(envelope: Envelope): Promise<void>;

        public readonly acknowledged: Envelope[]

        public readonly rejected: Envelope[];

        public readonly sent: Envelope[];

        private _encode(envelope: Envelope): any;

        private _decode(messagesEncoded: any[]): Envelope[];
    }
}
