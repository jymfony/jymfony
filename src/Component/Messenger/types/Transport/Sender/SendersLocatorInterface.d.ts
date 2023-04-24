declare namespace Jymfony.Component.Messenger.Transport.Sender {
    import Envelope = Jymfony.Component.Messenger.Envelope;

    /**
     * Maps a message to a list of senders.
     */
    export class SendersLocatorInterface {
        public static readonly definition: Newable<SendersLocatorInterface>;

        /**
         * Gets the senders for the given message name.
         *
         * @param envelope
         *
         * @returns Indexed by sender alias if available
         */
        getSenders(envelope: Envelope): Record<string, SenderInterface>;
    }
}
