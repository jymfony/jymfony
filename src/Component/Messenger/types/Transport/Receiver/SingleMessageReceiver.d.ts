declare namespace Jymfony.Component.Messenger.Transport.Receiver {
    import Envelope = Jymfony.Component.Messenger.Envelope;

    /**
     * Receiver that decorates another, but receives only 1 specific message.
     *
     * @internal
     */
    export class SingleMessageReceiver extends implementationOf(ReceiverInterface) {
        private _receiver: ReceiverInterface;
        private _envelope: Envelope;
        private _hasReceived: boolean;

        /**
         * Constructor.
         */
        __construct(receiver: ReceiverInterface, envelope: Envelope): void;
        constructor(receiver: ReceiverInterface, envelope: Envelope);

        get(): Envelope[];

        ack(envelope: Envelope): Promise<void>;

        reject(envelope: Envelope): Promise<void>;
    }
}
