declare namespace Jymfony.Component.Messenger.Transport.Sync {
    import Envelope = Jymfony.Component.Messenger.Envelope;
    import MessageBusInterface = Jymfony.Component.Messenger.MessageBusInterface;
    import TransportInterface = Jymfony.Component.Messenger.Transport.TransportInterface;

    /**
     * Transport that immediately marks messages as received and dispatches for handling.
     */
    export class SyncTransport extends implementationOf(TransportInterface) {
        private _messageBus: MessageBusInterface;

        /**
         * Constructor.
         */
        __construct(messageBus: MessageBusInterface): void;
        constructor(messageBus: MessageBusInterface);

        get(): Promise<Envelope[]>;

        stop(): Promise<void>;

        ack(): Promise<void>;

        reject(): Promise<void>;

        send(envelope): Promise<Envelope>;
    }
}
