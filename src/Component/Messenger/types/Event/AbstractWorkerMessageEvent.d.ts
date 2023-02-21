declare namespace Jymfony.Component.Messenger.Event {
    import Envelope = Jymfony.Component.Messenger.Envelope;
    import StampInterface = Jymfony.Component.Messenger.Stamp.StampInterface;

    export abstract class AbstractWorkerMessageEvent {
        private _envelope: Envelope;
        private _receiverName: string;

        /**
         * Constructor.
         */
        __construct(envelope: Envelope, receiverName: string): void;
        constructor(envelope: Envelope, receiverName: string);

        public readonly envelope: Envelope;

        /**
         * Returns a unique identifier for transport receiver this message was received from.
         */
        public readonly receiverName: string;

        addStamps(...stamps: StampInterface[]): void;
    }
}
