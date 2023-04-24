declare namespace Jymfony.Component.Messenger.Stamp {
    /**
     * Marker stamp identifying a message sent by the `SendMessageMiddleware`.
     *
     * @see Jymfony.Component.Messenger.Middleware.SendMessageMiddleware
     *
     * @final
     */
    export class SentStamp extends implementationOf(NonSendableStampInterface) {
        private _senderClass: string;
        private _senderAlias: string | null;

        /**
         * Constructor.
         */
        __construct(senderClass: string, senderAlias?: string | null): void;
        constructor(senderClass: string, senderAlias?: string | null);

        public readonly senderClass: string;

        public readonly senderAlias: string | null;
    }
}
