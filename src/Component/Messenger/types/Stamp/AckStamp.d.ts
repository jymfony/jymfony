declare namespace Jymfony.Component.Messenger.Stamp {
    import Envelope = Jymfony.Component.Messenger.Envelope;

    /**
     * Marker stamp for messages that can be ack/nack'ed.
     *
     * @final
     */
    export class AckStamp extends implementationOf(NonSendableStampInterface) {
        private _ack: (envelope: Envelope, e: (Error | null)) => Promise<void>;

        /**
         * Constructor.
         *
         * @param {function(Jymfony.Component.Messenger.Envelope, Error|null): Promise<void>} ack
         */
        __construct(ack: (envelope: Envelope, e: Error | null) => Promise<void>): void;
        constructor(ack: (envelope: Envelope, e: Error | null) => Promise<void>);

        ack(envelope: Envelope, e?: Error | null): Promise<void>;
    }
}
