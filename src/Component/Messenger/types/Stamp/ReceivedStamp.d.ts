declare namespace Jymfony.Component.Messenger.Stamp {
    /**
     * Marker stamp for a received message.
     *
     * This is mainly used by the `SendMessageMiddleware` middleware to identify
     * a message should not be sent if it was just received.
     *
     * @see {Jymfony.Component.Messenger.Middleware.SendMessageMiddleware}
     *
     * @final
     */
    export class ReceivedStamp extends implementationOf(NonSendableStampInterface) {
        private _transportName: string;

        /**
         * Constructor.
         */
        __construct(transportName: string);
        constructor(transportName: string);

        public readonly transportName: string;
    }
}
