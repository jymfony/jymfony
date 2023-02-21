declare namespace Jymfony.Component.Messenger.Stamp {
    /**
     * Stamp applied when a message is sent to the failure transport.
     *
     * @final
     */
    export class SentToFailureTransportStamp extends implementationOf(StampInterface) {
        private _originalReceiverName: string;

        /**
         * Constructor.
         */
        __construct(originalReceiverName: string): void;
        constructor(originalReceiverName: string);

        public readonly originalReceiverName: string;
    }
}
